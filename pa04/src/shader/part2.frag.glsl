#define NUM_LIGHTS 2

uniform sampler2D diffuseTex;  // Texture for the diffuse component Kd

// Light positions and colors
struct Light {
    vec3 color;
    vec3 position;  // In camera coordinates
};
uniform Light lights[NUM_LIGHTS];

uniform float alpha;    // The specular exponent
uniform float specular; // The Ks term in the Blinn-Phong model

in vec2 texCoord;
in vec3 fNormal;    // fragment normal in camera coordinates
in vec3 fPosition;  // fragment position in camera coordinates

void main() {

    // TODO - Part 2 - Compute the Blinn-Phong shading model using the uniform variables above.
    //        Sum the contributions of each light with a loop.
    
    pc_fragColor = vec4(1,0,0, 1.0); 
}
