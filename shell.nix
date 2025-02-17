{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  shellHook = ''
    npm install -g vite 
    npm install three vite-plugin-glsl
    npm install
  '';
}
