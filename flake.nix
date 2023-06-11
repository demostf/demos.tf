{
  inputs = {
    nixpkgs.url = "nixpkgs/release-23.05";
    utils.url = "github:numtide/flake-utils";
    npmlock2nix = {
      url = "github:nix-community/npmlock2nix";
      flake = false;
    };
  };

  outputs = {
    self,
    nixpkgs,
    utils,
    npmlock2nix,
  }:
    utils.lib.eachDefaultSystem (system: let
      overlays = [
        (final: prev: {
          npmlock2nix = prev.callPackage npmlock2nix {};
        })
      ];
      pkgs = import nixpkgs {
        inherit system overlays;
      };
      npmLd = pkgs.writeShellScriptBin "npm" ''
        PATH="$PATH ${pkgs.nodejs_20}/bin" LD=$CC ${pkgs.nodejs_20}/bin/npm $@
      '';
      nodeLd = pkgs.writeShellScriptBin "node" ''
        LD=$CC ${pkgs.nodejs_20}/bin/node $@
      '';
      lib = pkgs.lib;
      src = lib.sources.sourceByRegex (lib.cleanSource ./.) ["package.*" "src(/.*)?" "tsconfig.json" ".*.config.js"];

      buildImages = name: src: installPhase: pkgs.stdenv.mkDerivation {
        name = "demos-tf-${name}";
        version = "0.1.0";

        inherit src installPhase;

        nativeBuildInputs = with pkgs; [xcftools imagemagick];
        buildPhase = with pkgs; ''
          make
        '';
      };
      nodeSource = nodejs: pkgs.runCommand "node-sources-${nodejs.version}"
        { } ''
        tar --no-same-owner --no-same-permissions -xf ${nodejs.src}
        mv node-* $out
      '';
    in rec {
      packages = rec {
        level-overview = buildImages "level-overview" ./src/images/leveloverview ''
          cp -r dist $out
        '';
        class-portraits = buildImages "class-portraits" ./src/images/class_portraits ''
          mkdir $out
          cp *.jpg *.png *.webp $out/
        '';
        demos-tf = pkgs.npmlock2nix.v2.build {
          inherit src;
          installPhase = ''
            # remove references to node_modules from source maps
            nuke-refs build/*
            cp -r build $out
          '';
          buildCommands = [
            "cp -T -r ${level-overview} src/images/leveloverview/dist"
            "cp -T -r ${class-portraits} src/images/class_portraits"
            "npm run build"
          ];
          nativeBuildInputs = with pkgs; [ nukeReferences ];
          node_modules_attrs = {
            buildInputs = with pkgs; [ vips ];
            nativeBuildInputs = with pkgs; [ pkg-config python3 ];
            postBuild = ''
              npm rebuild sharp --nodedir=${nodeSource pkgs.nodejs_20}
            '';
          };
          nodejs = pkgs.nodejs_20;
        };
        default = demos-tf;
        entrypoint = pkgs.writeShellApplication {
          name = "docker-entrypoint";
          runtimeInputs = [
           pkgs.envsubst
           (pkgs.nginx.override {
             modules = pkgs.nginx.modules ++ [pkgs.nginxModules.brotli];
           })
          ];
          text = ''
             export DOLLAR='$'

             envsubst < /etc/nginx/upload.tmpl > /etc/nginx/upload.conf
             for f in /etc/nginx/conf.d/*.tmpl
             do
                  envsubst < "$f" > "$f.conf"
             done

             exec nginx
           '';
        };
        dockerImage = pkgs.dockerTools.buildImage {
          name = "demostf/demos.tf";
          tag = "latest";
          contents = [
            pkgs.fakeNss
            entrypoint
          ];
          runAsRoot = ''
            #!${pkgs.runtimeShell}
            mkdir -p /etc/nginx/conf.d /usr/share/nginx/
            mkdir -p /var/log/nginx/
            cp ${./nginx.conf} /etc/nginx/nginx.conf
            cp ${./upload.tmpl} /etc/nginx/upload.tmpl
            cp ${./demostf.tmpl} /etc/nginx/conf.d/demostf.tmpl
            cp -rL ${demos-tf} /usr/share/nginx/html
          '';
          config = {
            Cmd = [ "${entrypoint}/bin/docker-entrypoint" ];
          };
        };
      };
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = with pkgs; [
          pkg-config
          python3
          vips
          xcftools
          nodejs_20
        ];
      };
    });
}
