
out vec3 fPositionWorld;
out vec3 fNormalWorld;

void main() {

    // TODO: Part 5 - Convert the position (position) and normal (normal) into world coordinates using
    //     modelMatrix.  Send the transformed values to the fragment shader via the output variables
    //     fPositionWorld and fNormalWorld.  Be sure to normalize the normal before writing.

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
