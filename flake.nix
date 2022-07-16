{
  inputs = {
    nixpkgs.url = "nixpkgs/release-22.05";
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
    in rec {
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = with pkgs; [
          nodejs-16_x
          autoconf
          automake
          libtool
          pkg-config
          nasm
          zlib
        ];

        LD = "gcc";
      };
    });
}
