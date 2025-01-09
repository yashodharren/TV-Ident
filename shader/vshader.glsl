attribute vec3 vPosition;
attribute vec3 vColor;
varying vec4 color;

uniform vec2 canvasSize;

uniform float theta;
uniform float scale;
uniform vec2 location;

mat2 rotate(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void
main()
{

    gl_PointSize = 1.0;

    // Rotate the position around the origin
    vec2 rotatedPosition = rotate(theta) * vPosition.xy;

    // Scale the position
    vec2 scaledPosition = rotatedPosition * scale;

    // Translate the position
    vec2 translatedPosition = scaledPosition + (location/canvasSize);

    // Convert the position from pixels to clip coordinates
    vec2 clipSpacePosition = translatedPosition;

    gl_Position = vec4(clipSpacePosition, 0.0, 1.0);
    color = vec4(vColor, 1.0);
}