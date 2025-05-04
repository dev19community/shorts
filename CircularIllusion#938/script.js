RGBA(`

float sdOrientedBox( in vec2 p, in vec2 a, in vec2 b, float th )
{
    float l = length(b-a);
    vec2  d = (b-a)/l;
    vec2  q = (p-(a+b)*0.5);
          q = mat2(d.x,-d.y,d.y,d.x)*q;
          q = abs(q)-vec2(l,th)*0.5;
    return length(max(q,0.0)) + min(max(q.x,q.y),0.0);    
}

float sdCross( in vec2 p, in float size ) {
  float width = 0.05;
  float line = 0.01;
 
  float outer0 = sdOrientedBox(p, vec2(size, size), vec2(-size, -size), width);
  
  float inner0 = sdOrientedBox(p, vec2(size - line, size - line), vec2(-size + line, -size + line), width - line * 2.5);
  
  float outer1 = sdOrientedBox(p, vec2(-size, size), vec2(size, -size), width);
  
  float inner1 = sdOrientedBox(p, vec2(-size + line, size - line), vec2(size - line, -size + line), width - line * 2.5);
  
  float innerCross = min(inner0, inner1);
  float outerCross = min(outer0, outer1);
  
  return max(outerCross, -innerCross);
}

float sdSquare( in vec2 p, in float size ) {
  float width = 0.05;
  float line = 0.01;
 
  float outer = sdOrientedBox(p, vec2(size, size), vec2(-size, -size), size * 2.65);
  
  float inner = sdOrientedBox(p, vec2(size - line, size - line), vec2(-size + line, -size + line), (size * 2.65) - line * 2.5);
  
  return max(outer, -inner);
}

vec2 getPosition(in vec2 uv, in vec2 p, in float step) {
  float row = floor((uv.y - 0.01) * (1.0 / step * 0.5)) * step;
  float diffX = sin(time + row * 40.) * 0.5;
  
  float stepX = step;
  float stepY = step;
  
  return mod(uv + vec2(diffX + p.x, p.y), step * 2.) - vec2(stepX, stepY);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy*2.-1.;
  uv.y *= resolution.y/resolution.x;
  
  uv=vec2(atan(uv.y,uv.x),(log(length(uv))-time * 0.1)*0.85);
  
  vec2 from = vec2(0.1, 0.1);
	vec2 to = vec2(0.3, 0.3);
  float width = 0.05;
  
  float step = 0.15;
  float row = floor((uv.y - 0.01) * 4.0) * step;
  float diffX = sin(time + row * 40.) * 0.5;
  
  float stepX = step;
  float stepY = step;
 
  float d = 1.;
  // d = min(sdCross(getPosition(uv, vec2(0.)), 0.08), d);
  // d = min(sdCross(getPosition(uv, vec2(step, 0.)), 0.054), d);
  // d = min(sdSquare(getPosition(uv, vec2(step, 0.)), 0.054), d);
  
  float lineWidth = 0.025;
  float halfWidth = lineWidth * 0.37;
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(0.), step), 
    vec2(-0.08, -0.08), 
    vec2(0.08, 0.08), 
    lineWidth
  ), d);
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(0.), step), 
    vec2(0.08, -0.08), 
    vec2(-0.08, 0.08), 
    lineWidth
  ), d);
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(0., -0.07), step), 
    vec2(halfWidth, -halfWidth), 
    vec2(-halfWidth, halfWidth), 
    lineWidth
  ), d);
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(0., 0.07), step), 
    vec2(halfWidth, -halfWidth), 
    vec2(-halfWidth, halfWidth), 
    lineWidth
  ), d);
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(step, -0.07), step), 
    vec2(halfWidth, -halfWidth), 
    vec2(-halfWidth, halfWidth), 
    lineWidth
  ), d);
  
  // figure
  d = min(sdOrientedBox(
    getPosition(uv, vec2(step, 0.07), step), 
    vec2(halfWidth, -halfWidth), 
    vec2(-halfWidth, halfWidth), 
    lineWidth
  ), d);
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(step, 0.0), step), 
    vec2(halfWidth, -halfWidth), 
    vec2(-0.045, 0.045), 
    lineWidth
  ), d);
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(step, 0.0), step), 
    vec2(-halfWidth, -halfWidth), 
    vec2(0.045, 0.045), 
    lineWidth
  ), d);
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(step, 0.07), step), 
    vec2(halfWidth, -halfWidth), 
    vec2(-halfWidth, halfWidth), 
    lineWidth
  ), d);
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(step, 0.07), step), 
    vec2(halfWidth, -halfWidth), 
    vec2(-0.085, 0.085), 
    lineWidth
  ), d);
  
  d = min(sdOrientedBox(
    getPosition(uv, vec2(step, 0.07), step), 
    vec2(-halfWidth, -halfWidth), 
    vec2(0.085, 0.085), 
    lineWidth
  ), d);
  
  float min = mod(time, 2.5) - 1.25;
  float max = mod(time, 2.5);
  // bool inverted = distance(uv, vec2(0.0)) < min || distance(uv, vec2(0.0)) > max;
  
  bool inverted = sin(uv.y / step * 1.5 + time * 2.) >= 0.0;
  
  d = inverted ? smoothstep(0.0, 0.01, d) : smoothstep(0.0, -0.0001, d);
  
  vec3 fgColor = vec3(0.8, 0., 0.);
  vec3 bgColor = inverted ? vec3(1., 1., 1.) : vec3(0., 0., 0.);

  vec3 color = mix(fgColor, bgColor, d);
   
  gl_FragColor = vec4(color, 1.);
}
`);