
// The diffuse texture (use for the base color)
uniform sampler2D diffuseTex;
// The AO texture
uniform sampler2D aoTex;

// The interpolated texture coordinate
in vec2 texCoord;

void main() {
    
    // TODO: Part 1 - Use the product of the RGB from the two textures as the color for the fragment

    pc_fragColor = vec4(1,0,0,1);
}