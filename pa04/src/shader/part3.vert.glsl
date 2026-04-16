in vec4 tangent;

out vec2 texCoord;
out vec3 fPosition;
out vec3 fNormal;
out vec3 fTang;
out vec3 fBitan;

void main() {
    texCoord = uv;

    // TODO: Part 3 - convert position and normal to camera coordinates as in the previous step.
    //       The tangent vector in object coordinates is provided in the input variable tangent.
    //       Compute the tangent and bi-tangent in camera coordinates and pass them to the fragment
    //       shader using fTang and fBitan.  Make sure to normalize all of these (except position of course).

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
