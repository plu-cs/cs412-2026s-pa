#define NUM_LIGHTS 2

uniform sampler2D diffuseTex;  // Texture for the Kd component
uniform sampler2D glossMap;    // Texture for the specular exponent
uniform sampler2D normalMap;   // Texture for the normal map
uniform sampler2D specularMap; // Specular map texture

// Lights
struct Light {
    vec3 color;
    vec3 position;  // In camera coordinates
};
uniform Light lights[NUM_LIGHTS];

// Scaling factor controlling the strength of the normal map
uniform float bumpiness;

in vec2 texCoord;
in vec3 fNormal;    // fragment normal in camera coordinates
in vec3 fPosition;  // fragment position in camera coordinates
in vec3 fTang;      // The tangent vector in camera coordinates
in vec3 fBitan;     // The bi-tangent vector in camera coordinates

void main() {

    // TODO - Part 3 - Compute the Blinn-Phong model as in part 2, however this time, modify the normal
    //     vector using the normalMap, take the specular reflectivity (Ks) from the specularMap, 
    //     and take the specular exponent from the glossMap (use 2 to the power of the red channel * 13).
    
    pc_fragColor = vec4(1,0,0, 1.0); 
}
