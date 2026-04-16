#define NUM_LIGHTS 2
#define PI 3.141592653589793

uniform sampler2D diffuseTex;

struct Light {
    vec3 color;
    vec3 position;  // In camera coordinates
};
uniform Light lights[NUM_LIGHTS];

uniform float alpha;

in vec2 texCoord;
in vec3 fNormal;    // fragment normal in camera coordinates
in vec3 fPosition;  // fragment position in camera coordinates

// Forward declarations, complete functions are listed below main
float computeF( float c );
float computeD( vec3 N, vec3 H );
float computeG( vec3 N, vec3 H, vec3 L, vec3 V );

float nt = 2.0;
float ni = 1.0;

void main() {

    // TODO: Part 4 - Compute the microfacet shading model described in the assignment.
    //       sum the results for each light source.  Use a sample from diffuseTex as the value
    //       of the diffuse reflectance.  Other parameters are available as uniform variables.
    //       You may call any of the provided functions below.
    
    pc_fragColor = vec4(1,0,0, 1.0); 
}


// Compute Fresnel term for microfacet shading
//    c: Dot product of the halfway vector and the vector to the light source (wi)
float computeF(float c) {
    c = abs(c);
    float gSquared = (nt * nt) / (ni * ni) - 1.0 + c * c;
    // clamp if irrational
    float F = 1.0;
    if (gSquared >= 0.0) {
        float g = sqrt(gSquared);
        F = 0.5 * ((g - c) * (g - c)) / ((g + c) * (g + c));
        F = F * (1.0 + ((c * (g + c) - 1.0) / (c * (g - c) + 1.0)) * 
            ((c * (g + c) - 1.0) / (c * (g - c) + 1.0)));
    }
    return F;
}

// Compute microfacet distribution using Beckmann distribution
// Arguments:
//    N: normal vector
//    H: half vector between the vector from the light and the vector to the camera with unit length
float computeD(vec3 N, vec3 H) {
    float D = 0.0;
    if (dot(H, N) > 0.0) {
        float cos_thetam = dot(H, N);
        float cos_thetam2 = cos_thetam * cos_thetam;
        float sin_thetam2 = 1.0 - cos_thetam2;
        float cos_thetam4 = cos_thetam2 * cos_thetam2;
        float tan_thetam2 = sin_thetam2 / cos_thetam2;
        D = exp(-tan_thetam2 / (alpha * alpha));
        D = D / (PI * alpha * alpha * cos_thetam4);
    }
    return D;
}

// Called only by computeG()
// Arguments:
//   I: vector 
//   H: half vector between the vector from the light and the vector to the camera with unit length
//   N: normal vector
float gHelper(vec3 I, vec3 H, vec3 N) {
    float G = 0.0;
    float vm = dot(I, H);           
    float vn = dot(I, N);
    if (vm / vn > 0.0) {
        float cos_thetav = dot(normalize(I), normalize(N));
        float sin_thetav = sqrt(1.0 - cos_thetav * cos_thetav);
        float tan_thetav = sin_thetav / cos_thetav;
        float a = 1.0 / (alpha * tan_thetav);
        if (a > 1.6) {
            G = 1.0;
        } else {
            G = 3.535 * a + 2.181 * a * a;
            G = G / (1.0 + 2.276 * a + 2.577 * a * a);
        }
    }
    return G;
}

// Compute geometric attenuation for Beckmann microfacet shading
//    N: normal vector
//    H: half vector between the vector from the light and the vector to the camera with unit length
//    L: vector from the light source
//    V: vector to the camera
float computeG(vec3 N, vec3 H, vec3 L, vec3 V) {
    float G_im = gHelper(L, H, N);
    float G_om = gHelper(V, H, N);
    float G = G_im * G_om;
    return G;
}
 