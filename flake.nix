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
        PATH="$PATH ${pkgs.nodejs-16_x}/bin" LD=$CC ${pkgs.nodejs-16_x}/bin/npm $@
      '';
      nodeLd = pkgs.writeShellScriptBin "node" ''
        LD=$CC ${pkgs.nodejs-16_x}/bin/node $@
      '';
      lib = pkgs.lib;
      src = lib.sources.sourceByRegex (lib.cleanSource ./.) ["package.*" "src(/.*)?" "tsconfig.json" ".*.config.js"];
    in rec {
      packages = {
        leveloverview = pkgs.stdenv.mkDerivation rec {
          name = "demos-tf-leveloverview";
          version = "0.1.0";

          src = ./src/images/leveloverview;

          nativeBuildInputs = with pkgs; [xcftools];
          buildPhase = with pkgs; ''
            cp -r ${node_modules}/node_modules ./node_modules
            npm run build
          '';

          installPhase = ''
            cp -r dist $out
          '';
        };
        demos-tf = pkgs.npmlock2nix.v2.build {
          inherit src;
          installPhase = "cp -r build $out";
          buildCommands = [
            "cd "
            "npm run build"
          ];
          nodejs = pkgs.nodejs_20;
        };
      };
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = with pkgs; [
          autoconf
          automake
          libtool
          pkg-config
          nasm
          zlib
          python3
          vips
          npmLd
          nodeLd
          xcftools
        ];
      };
    });
}
