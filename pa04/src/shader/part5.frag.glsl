
uniform samplerCube cubeTex;

in vec3 fNormalWorld;    // fragment normal in world coordinates
in vec3 fPositionWorld;  // fragment position in world coordinates

void main() {

    // TODO: Part 5 - Compute the reflection direction in world coordinates across the normal vector.
    //          To do so, you can use the built-in GLSL function reflect() or calculate it yourself.
    //          You'll need the camera position which is available in the variable cameraPosition.
    //          Then, flip (negate) the x component of the reflected direction.  This is necessary due to the 
    //          way that ThreeJS and WebGL store and use cube maps (WebGL uses a left-handed coordinate
    //          system for legacy reasons.... ugh!).
    //          Use the reflection direction to access cubeTex, and use the result as the output color.

    pc_fragColor = vec4(1,0,0, 1.0);
}
