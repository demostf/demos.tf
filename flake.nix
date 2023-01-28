{
  inputs = {
    nixpkgs.url = "nixpkgs/release-22.11";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    utils,
  }:
    utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
      npmLd = pkgs.writeShellScriptBin "npm" ''
        PATH="$PATH ${pkgs.nodejs-16_x}/bin" LD=$CC ${pkgs.nodejs-16_x}/bin/npm $@
      '';
      nodeLd = pkgs.writeShellScriptBin "node" ''
        LD=$CC ${pkgs.nodejs-16_x}/bin/node $@
      '';
    in rec {
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
        ];
      };
    });
}
