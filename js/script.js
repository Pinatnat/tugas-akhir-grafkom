/**
 * 
 * Variables used
 * 
 * */

var gl;

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

// buffer for mutiple shapes
var cubeVertexPositionBuffer;
var cubeVertexNormalBuffer;
var cubeInsidesVertexNormalBuffer;
var cubeVertexIndexBuffer;
var cubeTextureBuffer;

var cylinderVertexPositionBuffer;
var cylinderVertexNormalBuffer;
var cylinderVertexIndexBuffer;
var cylinderTextureBuffer;

var sphereVertexPositionBuffer;
var sphereVertexNormalBuffer;
var sphereVertexIndexBuffer;
var sphereTextureBuffer;

var shadowFrameBuffer;

// variable for material
var armMaterial;
var cameraMaterial;
var DuckMaterial;
var SnowManMaterial;
var DogMaterial;
var roomMaterial;

var animating = 1;

var lightSourceNode;
var roomNode;

//variable for robot arm
var baseArmNode; var baseArmAngle = 0;
var firstArmNode;
var secondArmNode; var secondArmAngle = 0; var secondArmDirection = 1;
var palmNode; var palmAngle = 0;
var firstFingerBaseNode; var firstFingerBaseAngle = 0; var firstFingerBaseDirection = 1;
var firstFingerTopNode; var firstFingerTopAngle = 0; var firstFingerTopDirection = 1;
var secondFingerBaseNode; var secondFingerBaseAngle = 0; var secondFingerBaseDirection = 1;
var secondFingerTopNode; var secondFingerTopAngle = 0; var secondFingerTopDirection = 1;
var thirdFingerBaseNode; var thirdFingerBaseAngle = 0; var thirdFingerBaseDirection = 1;
var thirdFingerTopNode; var thirdFingerTopAngle = 0; var thirdFingerTopDirection = 1;

//variable for camera
var baseCameraNode; var baseCameraAngle = 0;
var firstCameraLegNode; var firstCameraLegAngle = 0; var firstCameraLegDirection = 1;
var secondCameraLegNode; var secondCameraLegAngle = 0; var secondCameraLegDirection = 1;
var thirdCameraLegNode; var thirdCameraLegAngle = 0; var thirdCameraLegDirection = 1;
var firstCameraBodyNode;
var secondCameraBodyNode; var secondCameraBodyTranslation = 0; var secondCameraBodyDirection = 1;
var thirdCameraBodyNode; var thirdCameraBodyTranslation = 0; var thirdCameraBodyDirection = 1;
var fourthCameraBodyNode; var fourthCameraBodyTranslation = 0; var fourthCameraBodyDirection = 1;
var lensCameraNode; var lensCameraTranslation = 0; var lensCameraDirection = 1;
var shutterCameraNode; var shutterCameraTranslation = 0.45; var shutterCameraDirection = 1;

//variable for Duck
var baseDuckBodyNode; var baseDuckBodyAngle = 0;
var baseDuckNeckNode; var baseDuckNeckAngle = 1.6; var baseDuckNeckDirection = 1;
var baseDuckFirstUpNode; var baseDuckFirstUpAngle = 0.9; var baseDuckFirstUpDirection = 1;
var baseDuckSecondUpNode; var baseDuckSecondUpAngle = 0; var baseDuckSecondUpDirection = 1;
var baseDuckHeadNode; var baseDuckHeadAngle = 0; var baseDuckHeadDirection = 1;
var baseDuckFirstDownNode; var baseDuckFirstDownAngle = 0; var baseDuckFirstDownDirection = 1;
var baseDuckSecondDownNode; var baseDuckSecondDownAngle = 0; var baseDuckSecondDownDirection = 1;
var baseDuckFirstWingNode; var baseDuckFirstWingAngle = 5.7; var baseDuckFirstWingDirection = 1;
var baseDuckSecondWingNode; var baseDuckSecondWingAngle = 4.2; var baseDuckSecondWingDirection = 1;

//variable for random SnowMan
var baseSnowManNode; var baseSnowManx = 0; var baseSnowMany = 0; var baseSnowManz = 0; var baseSnowManAngle = 0;
var baseSnowMan2Node;
var baseSnowManxDirection = 1; var baseSnowManyDirection = 1; var baseSnowManzDirection = 1;
var baseSnowManAngleDirection = 1;

//variable for Dog
var baseDogNode;
var baseOneEarDogNode; var baseOneEarDogAngle=1;
var baseTwoEarDogNode; var baseTwoEarDogAngle = 1;
var baseDogXAngle = 0; var baseDogXAngleDirection = 1;
var baseDogYAngle = 0; var baseDogYAngleDirection = 1;
var baseDogZAngle = 0; var baseDogZAngleDirection = 1;
var baseDogX = 10; var baseDogXDirection = 1;
var baseDogY = 0; var baseDogYDirection = 1;
var baseDogZ = 0; var baseDogZDirection = 1;
var baseFirstFootDog; var baseSecondFootDog; var baseThirdFootDog; var baseFourFootDog;
var baseHeadDog; var baseOneEarDog; var baseTwoEarDog;

//variable for shadows
var shadowMapLookAtMatrix = mat4.create();
var shadowMapPerspectiveMatrix = mat4.create();
var shadowMapTransform = mat4.create();

//variables for lookat
var lookAtMatrix;
var lookAtMatrixSettings = 0;
var lookAtMatrixXPosition = 0;
var lookAtMatrixYPosition = 0;
var lookAtMatrixZPosition = 0;
var lookAtMatrixXAngle = 0;
var lookAtMatrixYAngle = 0;
var lookAtMatrixZAngle = 0;
var checkDefault = 0;
var checkObjek1 = 0;
var checkObjek2 = 0;


/**
 * 
 * Other functions
 * 
 * */

// convertion degree to radius
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

// choose texture
function chooseTexture(i, shadow) {
    if (!shadow) gl.uniform1i(gl.getUniformLocation(shaderProgram, "thetexture"), i);
}


/**
 * 
 * Initial GL, shader, buffer
 * 
 * */

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl2");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}


//adapted from http://learnwebgl.brown37.net/11_advanced_rendering/shadows.html
function createFrameBufferObject(gl, width, height) {
    var frameBuffer, depthBuffer;

    frameBuffer = gl.createFramebuffer();

    depthBuffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, depthBuffer);
    for (var i = 0; i < 6; i++) gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    frameBuffer.depthBuffer = depthBuffer;
    frameBuffer.width = width;
    frameBuffer.height = height;

    return frameBuffer;
}

var shaderProgram;
var shadowMapShaderProgram;

// initial for shader
function initShaders() {
    var fragmentShader = getShader(gl, "fs");
    var vertexShader = getShader(gl, "vs");
    shaderProgram = gl.createProgram();
    if (!shaderProgram) { alert("gak ok deh kakak"); }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    shaderProgram.vertexTextureAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.vertexTextureAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.useMaterialUniform = gl.getUniformLocation(shaderProgram, "uUseMaterial");
    shaderProgram.useTextureUniform = gl.getUniformLocation(shaderProgram, "uUseTexture");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");
    shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");
    shaderProgram.uMaterialAmbientColorUniform = gl.getUniformLocation(shaderProgram, "uMaterialAmbientColor");
    shaderProgram.uMaterialDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uMaterialDiffuseColor");
    shaderProgram.uMaterialSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uMaterialSpecularColor");
    shaderProgram.uMaterialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
    shaderProgram.uFarPlaneUniform = gl.getUniformLocation(shaderProgram, "uFarPlane");
    shaderProgram.shadowMapUniform = gl.getUniformLocation(shaderProgram, "shadowmap");

    var shadowMapFragmentShader = getShader(gl, "fs-shadowmap");
    var shadowMapVertexShader = getShader(gl, "vs-shadowmap");
    shadowMapShaderProgram = gl.createProgram();
    gl.attachShader(shadowMapShaderProgram, shadowMapVertexShader);
    gl.attachShader(shadowMapShaderProgram, shadowMapFragmentShader);
    gl.linkProgram(shadowMapShaderProgram);
    if (!gl.getProgramParameter(shadowMapShaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    gl.useProgram(shadowMapShaderProgram);
    shadowMapShaderProgram.mvMatrixUniform = gl.getUniformLocation(shadowMapShaderProgram, "uMVMatrix");
    shadowMapShaderProgram.pMatrixUniform = gl.getUniformLocation(shadowMapShaderProgram, "uPMatrix");
    shadowMapShaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shadowMapShaderProgram, "uPointLightingLocation");
    shadowMapShaderProgram.uFarPlaneUniform = gl.getUniformLocation(shadowMapShaderProgram, "uFarPlane");
    shadowMapShaderProgram.vertexPositionAttribute = gl.getAttribLocation(shadowMapShaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shadowMapShaderProgram.vertexPositionAttribute);

    gl.useProgram(shaderProgram);
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix(shadow) {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
    if (shadow) {
        gl.uniformMatrix4fv(shadowMapShaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shadowMapShaderProgram.mvMatrixUniform, false, mvMatrix);
    } else {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }
}

function setMatrixUniforms(shadow) {
    if (shadow) {
        gl.uniformMatrix4fv(shadowMapShaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shadowMapShaderProgram.mvMatrixUniform, false, mvMatrix);
    } else {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }
}


// Initial buffers
function initBuffers() {
    //DEFINING CUBE
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    vertices = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0,
        // Back face
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 24;
    cubeVertexNormalBuffer = gl.createBuffer();
    cubeInsidesVertexNormalBuffer = gl.createBuffer();
    var vertexNormals = [
        // Front face
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        // Back face
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        // Top face
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        // Bottom face
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        // Right face
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        // Left face
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
    ];
    var vertexInsidesNormals = [];
    for (var i = 0; i < vertexNormals.length; i++) {
        vertexInsidesNormals.push(vertexNormals[i] * -1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    cubeVertexNormalBuffer.itemSize = 3;
    cubeVertexNormalBuffer.numItems = 24;

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeInsidesVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexInsidesNormals), gl.STATIC_DRAW);
    cubeInsidesVertexNormalBuffer.itemSize = 3;
    cubeInsidesVertexNormalBuffer.numItems = 24;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 2, 0, 2, 3,    // Front face
        4, 5, 6, 4, 6, 7,    // Back face
        8, 9, 10, 8, 10, 11,  // Top face
        12, 13, 14, 12, 14, 15, // Bottom face
        16, 17, 18, 16, 18, 19, // Right face
        20, 21, 22, 20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;

    var textureCubeCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];
    cubeTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCubeCoords), gl.STATIC_DRAW);
    cubeTextureBuffer.itemSize = 2;
    cubeTextureBuffer.numItems = 24;

    //DEFINING CYLINDER
    //try making it with 20 segments
    var segment = 20;
    var deltaTheta = Math.PI * 360 / (180 * segment);
    var x, z;
    var cylinderBotVertices = [0, 0, 0];
    var cylinderTopVertices = [0, 1, 0];
    var cylinderSideVertices = [];
    var cylinderBotNormals = [0.0, -1.0, 0.0];
    var cylinderTopNormals = [0.0, 1.0, 0.0];
    var cylinderSideNormals = [];
    var cylinderBotTopTextureCoordinates = [0.5, 0.5];
    var cylinderSideTextureCoordinates = [];
    for (var i = 0; i <= segment; i++) {
        x = Math.cos(deltaTheta * i);
        z = Math.sin(deltaTheta * i);

        cylinderBotVertices.push(x, 0, z);
        cylinderBotNormals.push(0.0, -1.0, 0.0);
        cylinderBotTopTextureCoordinates.push((x + 1) / 2, (z + 1) / 2);

        cylinderSideVertices.push(x, 0, z);
        cylinderSideNormals.push(x, 0, z);
        cylinderSideTextureCoordinates.push(i / segment, 0.0);
        cylinderSideVertices.push(x, 1, z);
        cylinderSideNormals.push(x, 0, z);
        cylinderSideTextureCoordinates.push(i / segment, 1.0);

        cylinderTopVertices.push(x, 1, z);
        cylinderTopNormals.push(0.0, 1.0, 0.0);
    }
    cylinderVertexPositionBuffer = gl.createBuffer();
    cylinderVertexNormalBuffer = gl.createBuffer();
    cylinderTextureBuffer = gl.createBuffer();
    var cylinderVertices = cylinderBotVertices.concat(cylinderSideVertices).concat(cylinderTopVertices);
    var cylinderNormals = cylinderBotNormals.concat(cylinderSideNormals).concat(cylinderTopNormals);
    var cylinderTextureCoordinates = cylinderBotTopTextureCoordinates.concat(cylinderSideTextureCoordinates).concat(cylinderBotTopTextureCoordinates);
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderVertices), gl.STATIC_DRAW);
    cylinderVertexPositionBuffer.itemSize = 3;
    cylinderVertexPositionBuffer.numItems = cylinderVertices.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderNormals), gl.STATIC_DRAW);
    cylinderVertexNormalBuffer.itemSize = 3;
    cylinderVertexNormalBuffer.numItems = cylinderNormals.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderTextureCoordinates), gl.STATIC_DRAW);
    cylinderTextureBuffer.itemSize = 2;
    cylinderTextureBuffer.numItems = cylinderTextureCoordinates.length / 2;

    var cylinderIndices = [];
    //bot vertices
    for (var i = 2; i < cylinderBotVertices.length / 3; i++) {
        cylinderIndices.push(0, i - 1, i);
    }
    cylinderIndices.push(0, cylinderBotVertices.length / 3 - 1, 1);
    var offset = cylinderBotVertices.length / 3;
    //side vertices
    for (var i = 2; i < cylinderSideVertices.length / 3; i++) {
        cylinderIndices.push(offset + i - 2, offset + i - 1, offset + i);
    }
    cylinderIndices.push(offset + cylinderSideVertices.length / 3 - 2, offset + cylinderSideVertices.length / 3 - 1, offset);
    cylinderIndices.push(offset + cylinderSideVertices.length / 3 - 1, offset, offset + 1);
    offset += cylinderSideVertices.length / 3;
    for (var i = 2; i < cylinderTopVertices.length / 3; i++) {
        cylinderIndices.push(offset, offset + i - 1, offset + i);
    }
    cylinderIndices.push(offset, offset + cylinderTopVertices.length / 3 - 1, offset + 1);
    //console.log(cylinderVertices.length);
    //console.log(cylinderIndices);

    cylinderVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderIndices), gl.STATIC_DRAW);
    cylinderVertexIndexBuffer.itemSize = 1;
    cylinderVertexIndexBuffer.numItems = cylinderIndices.length;

    //DEFINING SPHERE
    var latitudeBands = 30;
    var longitudeBands = 30;
    var radius = 0.5;
    var vertexPositionData = [];
    var normalData = [];
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);
            normalData.push(-x);
            normalData.push(-y);
            normalData.push(-z);
            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }
    var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);
            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }
    sphereVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
    sphereVertexNormalBuffer.itemSize = 3;
    sphereVertexNormalBuffer.numItems = normalData.length / 3;
    sphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    sphereVertexPositionBuffer.itemSize = 3;
    sphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;
    sphereVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STREAM_DRAW);
    sphereVertexIndexBuffer.itemSize = 1;
    sphereVertexIndexBuffer.numItems = indexData.length;

    //don't use textures for spheres. Thus, mark all as 0
    sphereTextureBuffer = gl.createBuffer();
    var sphereTextures = [];
    for (var i = 0; i < normalData.length / 3; i++) {
        sphereTextures.push(0.0, 0.0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextures), gl.STATIC_DRAW);
    sphereTextureBuffer.itemSize = 2;
    sphereTextureBuffer.numItems = normalData.length / 3;

    shadowFrameBuffer = createFrameBufferObject(gl, 512, 512);

    
}

// Initial Attributes
function initializeAtrributes() {
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shadowMapShaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeTextureBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexTextureAttribute, cubeTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
}

/**
 * 
 * Setup to draw and materials
 * 
 * */

function setupToDrawCube(shadow) {
    if (shadow) {
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shadowMapShaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeTextureBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexTextureAttribute, cubeTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    }
}

function setupToDrawCubeInsides(shadow) {
    if (shadow) {
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shadowMapShaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeInsidesVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeInsidesVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeTextureBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexTextureAttribute, cubeTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    }
}

function setupToDrawCylinder(shadow) {
    if (shadow) {
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
        gl.vertexAttribPointer(shadowMapShaderProgram.vertexPositionAttribute, cylinderVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylinderVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylinderVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderTextureBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexTextureAttribute, cylinderTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
    }
}

function setupToDrawSphere(shadow) {
    if (shadow) {
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
        gl.vertexAttribPointer(shadowMapShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereTextureBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexTextureAttribute, sphereTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
    }
}

function setupMaterialBrass() {
    gl.uniform3f(shaderProgram.uMaterialAmbientColorUniform, 0.329412, 0.223529, 0.027451);
    gl.uniform3f(shaderProgram.uMaterialDiffuseColorUniform, 0.780392, 0.568627, 0.113725);
    gl.uniform3f(shaderProgram.uMaterialSpecularColorUniform, 0.992157, 0.941176, 0.807843);
    gl.uniform1f(shaderProgram.uMaterialShininessUniform, 27.8974);
}

function setupMaterialBronze() {
    gl.uniform3f(shaderProgram.uMaterialAmbientColorUniform, 0.2125, 0.1275, 0.054);
    gl.uniform3f(shaderProgram.uMaterialDiffuseColorUniform, 0.714, 0.4284, 0.18144);
    gl.uniform3f(shaderProgram.uMaterialSpecularColorUniform, 0.393548, 0.271906, 0.166721);
    gl.uniform1f(shaderProgram.uMaterialShininessUniform, 25.6);
}

function setupMaterialChrome() {
    gl.uniform3f(shaderProgram.uMaterialAmbientColorUniform, 0.25, 0.25, 0.25);
    gl.uniform3f(shaderProgram.uMaterialDiffuseColorUniform, 0.4, 0.4, 0.4774597);
    gl.uniform3f(shaderProgram.uMaterialSpecularColorUniform, 0.774597, 0.271906, 0.774597);
    gl.uniform1f(shaderProgram.uMaterialShininessUniform, 76.8);
}

function setupMaterialGold() {
    gl.uniform3f(shaderProgram.uMaterialAmbientColorUniform, 0.24725, 0.1995, 0.0745);
    gl.uniform3f(shaderProgram.uMaterialDiffuseColorUniform, 0.75164, 0.60648, 0.22648);
    gl.uniform3f(shaderProgram.uMaterialSpecularColorUniform, 0.628281, 0.555802, 0.366065);
    gl.uniform1f(shaderProgram.uMaterialShininessUniform, 51.2);
}

function setupMaterialForest() {
    gl.uniform3f(shaderProgram.uMaterialAmbientColorUniform, 0.4, 0.2225, 0.1575);
    gl.uniform3f(shaderProgram.uMaterialDiffuseColorUniform, 0.54, 0.89, 0.63);
    gl.uniform3f(shaderProgram.uMaterialSpecularColorUniform, 0.316228, 0.316228, 0.316228);
    gl.uniform1f(shaderProgram.uMaterialShininessUniform, 5.8);
}
function setupMaterialCopper() {
    gl.uniform3f(shaderProgram.uMaterialAmbientColorUniform, 0.1745, 0.375, 0.5);
    gl.uniform3f(shaderProgram.uMaterialDiffuseColorUniform, 0.61424, 0.3, 0.1);
    gl.uniform3f(shaderProgram.uMaterialSpecularColorUniform, 0.727811, 0.626959, 0.626959);
    gl.uniform1f(shaderProgram.uMaterialShininessUniform, 76.8);
}

function setupMaterial(material, shadow) {
    if (!shadow) {
        gl.uniform1i(shaderProgram.useMaterialUniform, true);
        if (material == "brass") {
            setupMaterialBrass();
        } else if (material == "bronze") {
            setupMaterialBronze();
        } else if (material == "chrome") {
            setupMaterialChrome();
        } else if (material == "gold") {
            setupMaterialGold();
        } else if (material == "forest") {
            setupMaterialForest();
        } else if (material == "copper") {
            setupMaterialCopper();
        } else if (material == "none") {
            setupMaterialChrome();
            gl.uniform1i(shaderProgram.useMaterialUniform, false);
        }
    }
}



/**
    * 
    * Init draw objects (lights, room, duck, Snow Man, robot arm, camera, dog)
    * 
    * */


/**
    * Setup lights & room
    * */

//draw light
function drawLightSource(shadow) {
    mvPushMatrix();
    //item specific modifications
    //draw
    setupToDrawSphere(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(1, shadow);
    setupMaterial("bronze", shadow);
    gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

//draw room
function drawRoom(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [10.0, 5.0, 30.0]);
    //draw
    setupToDrawCubeInsides(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(1, shadow);
    setupMaterial(roomMaterial, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}


/**
    * Draw Duck
    * */

function drawDuckBodyBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.5,1.5, 0.5]);
    //draw
    setupToDrawCylinder(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(8, shadow);
    setupMaterial(DuckMaterial, shadow);
    gl.drawElements(gl.TRIANGLES, cylinderVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawDuckNeckBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.2, 0.3, 0.2]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawDuckFirstUpLegBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.35, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}
function drawDuckSecondUpLegBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.35, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}
function drawDuckHeadBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.3, 0.6, 0.3]);
    //draw
    setupToDrawCylinder(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(8, shadow);
    gl.drawElements(gl.TRIANGLES, cylinderVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawDuckFirstDownLegBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.31, 0.35, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}
function drawDuckSecondDownLegBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.31, 0.35, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}
function drawDuckFirstWingBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.5, 0.5]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}
function drawDuckSecondWingBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.5, 0.5]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}


/**
* Draw SnowMan 
* */

function drawSnowManSource(shadow) {
    mvPushMatrix();
    //item specific modifications
    //draw
    setupToDrawSphere(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(1, shadow);
    setupMaterial(SnowManMaterial, shadow);
    gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawSnowMan2Source(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.8, 0.8, 0.8]);
    //draw
    setupToDrawSphere(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(1, shadow);
    setupMaterial(SnowManMaterial, shadow);
    gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

/**
* Draw dog
* */

//draw Dog
function drawDogBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.5, 0.5 , 1]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    setupMaterial(DogMaterial, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawFirstLegBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.5, 0.1]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawSecondLegBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.5, 0.1]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawThirdLegBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.5, 0.1]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawFourLegBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.5, 0.1]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawHeadBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.4, 0.3, 0.3]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}
function drawOneEarBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.2, 0.1]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawTwoEarBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.2, 0.1]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}


/**
* Draw robot arm
* */

function drawArmBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [1.0, 0.25, 1.0]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    setupMaterial(armMaterial, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawFirstArm(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.5, 2.0, 0.5]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(2, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawSecondArm(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.5, 2.0, 0.5]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(2, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawPalm(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.75, 0.25, 0.75]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(0, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawFingerBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.15, 0.3, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(0, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawFingerTop(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.15, 0.3, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(0, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

/**
    * Draw camera
    * */

//draw camera
function drawCameraBase(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.75, 0.25, 0.75]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    setupMaterial(cameraMaterial, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawCameraLeg(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.15, 2.0, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawCameraFirstBody(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.2, 0.5, 0.55]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(7, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawCameraSecondBody(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.45, 0.5]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(7, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawCameraThirdBody(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.4, 0.45]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(7, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawCameraFourthBody(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.35, 0.4]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(7, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawLensCamera(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.1, 0.2, 0.3]);
    //mat4.scale(mvMatrix, [0.5, 0.5, 0.5]);
    //draw
    setupToDrawCylinder(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(8, shadow);
    gl.drawElements(gl.TRIANGLES, cylinderVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}

function drawShutterCamera(shadow) {
    mvPushMatrix();
    //item specific modifications
    mat4.scale(mvMatrix, [0.15, 0.1, 0.1]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(shadow);
}


/**
* 
* Init object tree
* 
* */


function initObjectTree() {
    lightSourceNode = { "draw": drawLightSource, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(lightSourceNode.matrix, [document.getElementById("lightPositionX").value / 10.0, document.getElementById("lightPositionY").value / 10.0, document.getElementById("lightPositionZ").value / 10.0]);

    roomNode = { "draw": drawRoom, "matrix": mat4.identity(mat4.create()) };

    //Arm

    baseArmNode = { "draw": drawArmBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseArmNode.matrix, [-5.0, -5, 0.0]);
    mat4.rotate(baseArmNode.matrix, baseArmAngle, [0.0, 1.0, 0.0]);

    firstArmNode = { "draw": drawFirstArm, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(firstArmNode.matrix, [0.0, 1, 0.0]);

    secondArmNode = { "draw": drawSecondArm, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(secondArmNode.matrix, [0.0, 1, 0.0]);
    mat4.rotate(secondArmNode.matrix, secondArmAngle, [1.0, 0.0, 0.0]);
    mat4.translate(secondArmNode.matrix, [0.0, 2.0, 0.0]);

    palmNode = { "draw": drawPalm, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(palmNode.matrix, [0.0, 2.0, 0.0]);
    mat4.rotate(palmNode.matrix, palmAngle, [0.0, 1.0, 0.0]);

    firstFingerBaseNode = { "draw": drawFingerBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(firstFingerBaseNode.matrix, [0.45, 0.25, 0.45]);
    mat4.rotate(firstFingerBaseNode.matrix, firstFingerBaseAngle, [-1.0, 0.0, 1.0]);
    mat4.translate(firstFingerBaseNode.matrix, [0.0, 0.3, 0.0]);

    firstFingerTopNode = { "draw": drawFingerTop, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(firstFingerTopNode.matrix, [0.0, 0.3, 0.0]);
    mat4.rotate(firstFingerTopNode.matrix, firstFingerTopAngle, [-1.0, 0.0, 1.0]);
    mat4.translate(firstFingerTopNode.matrix, [0.0, 0.3, 0.0]);

    secondFingerBaseNode = { "draw": drawFingerBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(secondFingerBaseNode.matrix, [-0.45, 0.25, 0.45]);
    mat4.rotate(secondFingerBaseNode.matrix, secondFingerBaseAngle, [-1.0, 0.0, -1.0]);
    mat4.translate(secondFingerBaseNode.matrix, [0.0, 0.3, 0.0]);

    secondFingerTopNode = { "draw": drawFingerTop, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(secondFingerTopNode.matrix, [0.0, 0.3, 0.0]);
    mat4.rotate(secondFingerTopNode.matrix, secondFingerTopAngle, [-1.0, 0.0, -1.0]);
    mat4.translate(secondFingerTopNode.matrix, [0.0, 0.3, 0.0]);

    thirdFingerBaseNode = { "draw": drawFingerBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(thirdFingerBaseNode.matrix, [0.0, 0.25, -0.45]);
    mat4.rotate(thirdFingerBaseNode.matrix, thirdFingerBaseAngle, [1.0, 0.0, 0.0]);
    mat4.translate(thirdFingerBaseNode.matrix, [0.0, 0.3, 0.0]);


    thirdFingerTopNode = { "draw": drawFingerTop, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(thirdFingerTopNode.matrix, [0.0, 0.3, 0.0]);
    mat4.rotate(thirdFingerTopNode.matrix, thirdFingerTopAngle, [1.0, 0.0, 0.0]);
    mat4.translate(thirdFingerTopNode.matrix, [0.0, 0.3, 0.0]);

    //Camera

    baseCameraNode = { "draw": drawCameraBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseCameraNode.matrix, [5.0, 1.0, 0.0]);
    mat4.rotate(baseCameraNode.matrix, baseCameraAngle, [0.0, 1.0, 0.0]);

    firstCameraLegNode = { "draw": drawCameraLeg, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(firstCameraLegNode.matrix, [0.45, -0.25, 0.45]);
    mat4.rotate(firstCameraLegNode.matrix, firstCameraLegAngle, [-1.0, 0.0, 1.0]);
    mat4.translate(firstCameraLegNode.matrix, [0.0, -2.0, 0.0]);

    secondCameraLegNode = { "draw": drawCameraLeg, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(secondCameraLegNode.matrix, [-0.45, -0.25, 0.45]);
    mat4.rotate(secondCameraLegNode.matrix, secondCameraLegAngle, [-1.0, 0.0, -1.0]);
    mat4.translate(secondCameraLegNode.matrix, [0.0, -2.0, 0.0]);

    thirdCameraLegNode = { "draw": drawCameraLeg, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(thirdCameraLegNode.matrix, [0.0, -0.25, -0.45]);
    mat4.rotate(thirdCameraLegNode.matrix, thirdCameraLegAngle, [1.0, 0.0, 0.0]);
    mat4.translate(thirdCameraLegNode.matrix, [0.0, -2.0, 0.0]);

    firstCameraBodyNode = { "draw": drawCameraFirstBody, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(firstCameraBodyNode.matrix, [-0.2, 0.75, 0.0]);

    secondCameraBodyNode = { "draw": drawCameraSecondBody, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(secondCameraBodyNode.matrix, [secondCameraBodyTranslation, -0.05, 0.0]); //0.3

    thirdCameraBodyNode = { "draw": drawCameraThirdBody, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(thirdCameraBodyNode.matrix, [thirdCameraBodyTranslation, 0.0, 0.0]); //0.2

    fourthCameraBodyNode = { "draw": drawCameraFourthBody, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(fourthCameraBodyNode.matrix, [fourthCameraBodyTranslation, 0.0, 0.0]); //0.2

    lensCameraNode = { "draw": drawLensCamera, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(lensCameraNode.matrix, [lensCameraTranslation, 0.0, 0.0]); //0.25
    mat4.rotate(lensCameraNode.matrix, Math.PI / 2, [0.0, 0.0, 1.0]);

    shutterCameraNode = { "draw": drawShutterCamera, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(shutterCameraNode.matrix, [0.0, 0.35, shutterCameraTranslation]); //0.45 - 0.55

    //Duck

    baseDuckBodyNode = { "draw": drawDuckBodyBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDuckBodyNode.matrix, [-2.0, -2.0, 5.0]);
    mat4.rotate(baseDuckBodyNode.matrix, 30, [1.0, 0.0, 0.0]);
    mat4.rotate(baseDuckBodyNode.matrix, baseDuckBodyAngle, [0.0, 0.0, 1.0]);

    baseDuckNeckNode = { "draw": drawDuckNeckBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDuckNeckNode.matrix, [0.0, -0.2, 0.7]);
    mat4.rotate(baseDuckNeckNode.matrix, baseDuckNeckAngle, [1.0, 0.0, 0.0]);

    baseDuckFirstUpNode = { "draw": drawDuckFirstUpLegBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDuckFirstUpNode.matrix, [0.4, 0.6, -0.5]);
    mat4.rotate(baseDuckFirstUpNode.matrix, baseDuckFirstUpAngle, [1.0, 0.0, 0.0]);

    baseDuckSecondUpNode = { "draw": drawDuckSecondUpLegBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDuckSecondUpNode.matrix, [-0.4, 0.6, -0.5]);
    mat4.rotate(baseDuckSecondUpNode.matrix, baseDuckSecondUpAngle, [1.0, 0.0, 0.0]);

    baseDuckHeadNode = { "draw": drawDuckHeadBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDuckHeadNode.matrix, [0.0, 0.4, -0.1]);
    mat4.rotate(baseDuckHeadNode.matrix, baseDuckHeadAngle, [1.0, 0.0, 0.0]);

    baseDuckFirstDownNode = { "draw": drawDuckFirstDownLegBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDuckFirstDownNode.matrix, [-0.0, -0.5, 0.3]);
    mat4.rotate(baseDuckFirstDownNode.matrix, baseDuckFirstDownAngle, [1.0, 0.0, 0.0]);

    baseDuckSecondDownNode = { "draw": drawDuckSecondDownLegBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDuckSecondDownNode.matrix, [-0.0, -0.5, 0.3]);
    mat4.rotate(baseDuckSecondDownNode.matrix, baseDuckSecondDownAngle, [1.0, 0.0, 0.0]);

    baseDuckFirstWingNode = { "draw": drawDuckFirstWingBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDuckFirstWingNode.matrix, [0.2, 0.8, 0.3]);
    mat4.rotate(baseDuckFirstWingNode.matrix, baseDuckFirstWingAngle, [0.0, -6.0, 0.0]);

    baseDuckSecondWingNode = { "draw": drawDuckSecondWingBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDuckSecondWingNode.matrix, [-0.2, 0.8, 0.3]);
    mat4.rotate(baseDuckSecondWingNode.matrix, baseDuckSecondWingAngle, [0.0, -2.0, 0.0]);

    //Snow Man
    baseSnowManNode = { "draw": drawSnowManSource, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseSnowManNode.matrix, [1.0, 2.0, 5.0]);
    mat4.translate(baseSnowManNode.matrix, [baseSnowManx, baseSnowMany, baseSnowManz]);
    mat4.rotate(baseSnowManNode.matrix, baseSnowManAngle, [1.0, 1.0, 1.0]);


    baseSnowMan2Node = { "draw": drawSnowMan2Source, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseSnowMan2Node.matrix, [0, 0.8, 0]);
    
    //Dog
    baseDogNode = { "draw": drawDogBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseDogNode.matrix, [baseDogX, baseDogY, baseDogZ]);
    mat4.rotate(baseDogNode.matrix, baseDogXAngle, [1.0, 0.0, 0.0]);
    mat4.rotate(baseDogNode.matrix, baseDogZAngle, [0.0, 0.0, 1.0]);

    baseHeadDog = { "draw": drawHeadBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseHeadDog.matrix, [0, 0.7, 1.05]);

    baseOneEarDog = { "draw": drawOneEarBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseOneEarDog.matrix, [0.25, 0.4, -0.1]);

    baseTwoEarDog = { "draw": drawTwoEarBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseTwoEarDog.matrix, [-0.25, 0.4, -0.1]);

    baseFirstFootDog = { "draw": drawFirstLegBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseFirstFootDog.matrix, [0.4, -0.4, 0.9]);

    baseSecondFootDog = { "draw": drawSecondLegBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseSecondFootDog.matrix, [-0.4, -0.4, 0.9]);

    baseThirdFootDog = { "draw": drawThirdLegBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseThirdFootDog.matrix, [-0.4, -0.4, -0.9]);

    baseFourFootDog = { "draw": drawFourLegBase, "matrix": mat4.identity(mat4.create()) };
    mat4.translate(baseFourFootDog.matrix, [0.4, -0.4, -0.9]);


    baseArmNode.child = firstArmNode;
    firstArmNode.child = secondArmNode;
    secondArmNode.child = palmNode;
    palmNode.child = firstFingerBaseNode;
    firstFingerBaseNode.child = firstFingerTopNode;
    firstFingerBaseNode.sibling = secondFingerBaseNode;
    secondFingerBaseNode.child = secondFingerTopNode;
    secondFingerBaseNode.sibling = thirdFingerBaseNode;
    thirdFingerBaseNode.child = thirdFingerTopNode;

    baseArmNode.sibling = baseCameraNode;
    baseCameraNode.child = firstCameraLegNode;
    firstCameraLegNode.sibling = secondCameraLegNode;
    secondCameraLegNode.sibling = thirdCameraLegNode;
    thirdCameraLegNode.sibling = firstCameraBodyNode;
    firstCameraBodyNode.child = secondCameraBodyNode;
    secondCameraBodyNode.child = thirdCameraBodyNode;
    thirdCameraBodyNode.child = fourthCameraBodyNode;
    fourthCameraBodyNode.child = lensCameraNode;
    secondCameraBodyNode.sibling = shutterCameraNode;

    baseCameraNode.sibling = baseDuckBodyNode;
    baseDuckBodyNode.child = baseDuckNeckNode;
    baseDuckNeckNode.sibling = baseDuckFirstUpNode;
    baseDuckFirstUpNode.sibling = baseDuckSecondUpNode;
    baseDuckNeckNode.child = baseDuckHeadNode;
    baseDuckFirstUpNode.child = baseDuckFirstDownNode;
    baseDuckSecondUpNode.child = baseDuckSecondDownNode;
    baseDuckSecondUpNode.sibling = baseDuckFirstWingNode;
    baseDuckFirstWingNode.sibling = baseDuckSecondWingNode;

    baseDuckBodyNode.sibling = baseSnowManNode;

    baseSnowManNode.child = baseSnowMan2Node;

    baseSnowManNode.sibling = baseDogNode;

    baseDogNode.child = baseFirstFootDog;
    baseFirstFootDog.sibling = baseSecondFootDog;
    baseSecondFootDog.sibling = baseThirdFootDog;
    baseThirdFootDog.sibling = baseFourFootDog;
    baseFourFootDog.sibling = baseHeadDog;
    baseHeadDog.child = baseOneEarDog;
    baseOneEarDog.sibling = baseTwoEarDog;
}

function traverse(node, shadow) {
    mvPushMatrix();
    //modifications
    mat4.multiply(mvMatrix, node.matrix);
    //draw
    node.draw(shadow);
    if ("child" in node) traverse(node.child, shadow);
    mvPopMatrix(shadow);
    if ("sibling" in node) traverse(node.sibling, shadow);
}

/**
 * 
 * Representative for vector 3
 * 
 * */

// taken from http://learnwebgl.brown37.net/lib/learn_webgl_vector3.js
var Vector3 = function () {

    var self = this;

    /** ---------------------------------------------------------------------
    * Create a new 3-component vector.
    * @param dx Number The change in x of the vector.
    * @param dy Number The change in y of the vector.
    * @param dz Number The change in z of the vector.
    * @return Float32Array A new 3-component vector
    */
    self.create = function (dx, dy, dz) {
        var v = new Float32Array(3);
        v[0] = 0;
        v[1] = 0;
        v[2] = 0;
        if (arguments.length >= 1) { v[0] = dx; }
        if (arguments.length >= 2) { v[1] = dy; }
        if (arguments.length >= 3) { v[2] = dz; }
        return v;
    };

    /** ---------------------------------------------------------------------
    * Create a new 3-component vector and set its components equal to an existing vector.
    * @param from Float32Array An existing vector.
    * @return Float32Array A new 3-component vector with the same values as "from"
    */
    self.createFrom = function (from) {
        var v = new Float32Array(3);
        v[0] = from[0];
        v[1] = from[1];
        v[2] = from[2];
        return v;
    };

    /** ---------------------------------------------------------------------
    * Create a vector using two existing points.
    * @param tail Float32Array A 3-component point.
    * @param head Float32Array A 3-component point.
    * @return Float32Array A new 3-component vector defined by 2 points
    */
    self.createFrom2Points = function (tail, head) {
        var v = new Float32Array(3);
        self.subtract(v, head, tail);
        return v;
    };

    /** ---------------------------------------------------------------------
    * Copy a 3-component vector into another 3-component vector
    * @param to Float32Array A 3-component vector that you want changed.
    * @param from Float32Array A 3-component vector that is the source of data
    * @returns Float32Array The "to" 3-component vector
    */
    self.copy = function (to, from) {
        to[0] = from[0];
        to[1] = from[1];
        to[2] = from[2];
        return to;
    };

    /** ---------------------------------------------------------------------
    * Set the components of a 3-component vector.
    * @param v Float32Array The vector to change.
    * @param dx Number The change in x of the vector.
    * @param dy Number The change in y of the vector.
    * @param dz Number The change in z of the vector.
    */
    self.set = function (v, dx, dy, dz) {
        v[0] = dx;
        v[1] = dy;
        v[2] = dz;
    };

    /** ---------------------------------------------------------------------
    * Calculate the length of a vector.
    * @param v Float32Array A 3-component vector.
    * @return Number The length of a vector
    */
    self.length = function (v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    };

    /** ---------------------------------------------------------------------
    * Make a vector have a length of 1.
    * @param v Float32Array A 3-component vector.
    * @return Float32Array The input vector normalized to unit length. Or null if the vector is zero length.
    */
    self.normalize = function (v) {
        var length, percent;

        length = self.length(v);
        if (Math.abs(length) < 0.0000001) {
            return null; // Invalid vector
        }

        percent = 1.0 / length;
        v[0] = v[0] * percent;
        v[1] = v[1] * percent;
        v[2] = v[2] * percent;
        return v;
    };

    /** ---------------------------------------------------------------------
    * Add two vectors:  result = V0 + v1
    * @param result Float32Array A 3-component vector.
    * @param v0 Float32Array A 3-component vector.
    * @param v1 Float32Array A 3-component vector.
    */
    self.add = function (result, v0, v1) {
        result[0] = v0[0] + v1[0];
        result[1] = v0[1] + v1[1];
        result[2] = v0[2] + v1[2];
    };

    /** ---------------------------------------------------------------------
    * Subtract two vectors:  result = v0 - v1
    * @param result Float32Array A 3-component vector.
    * @param v0 Float32Array A 3-component vector.
    * @param v1 Float32Array A 3-component vector.
    */
    self.subtract = function (result, v0, v1) {
        result[0] = v0[0] - v1[0];
        result[1] = v0[1] - v1[1];
        result[2] = v0[2] - v1[2];
    };

    /** ---------------------------------------------------------------------
    * Scale a vector:  result = s * v0
    * @param result Float32Array A 3-component vector.
    * @param v0 Float32Array A 3-component vector.
    * @param s Number A scale factor.
    */
    self.scale = function (result, v0, s) {
        result[0] = v0[0] * s;
        result[1] = v0[1] * s;
        result[2] = v0[2] * s;
    };

    /** ---------------------------------------------------------------------
    * Calculate the cross product of 2 vectors: result = v0 x v1 (order matters)
    * @param result Float32Array A 3-component vector.
    * @param v0 Float32Array A 3-component vector.
    * @param v1 Float32Array A 3-component vector.
    */
    self.crossProduct = function (result, v0, v1) {
        result[0] = v0[1] * v1[2] - v0[2] * v1[1];
        result[1] = v0[2] * v1[0] - v0[0] * v1[2];
        result[2] = v0[0] * v1[1] - v0[1] * v1[0];
    };

    /** ---------------------------------------------------------------------
    * Calculate the dot product of 2 vectors
    * @param v0 Float32Array A 3-component vector.
    * @param v1 Float32Array A 3-component vector.
    * @return Number Float32Array The dot product of v0 and v1
    */
    self.dotProduct = function (v0, v1) {
        return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
    };

    /** ---------------------------------------------------------------------
    * Print a vector on the console.
    * @param name String A description of the vector to be printed.
    * @param v Float32Array A 3-component vector.
    */
    self.print = function (name, v) {
        var maximum, order, digits;

        maximum = Math.max(v[0], v[1], v[2]);
        order = Math.floor(Math.log(maximum) / Math.LN10 + 0.000000001);
        digits = (order <= 0) ? 5 : (order > 5) ? 0 : (5 - order);

        console.log("Vector3: " + name + ": " + v[0].toFixed(digits) + " "
            + v[1].toFixed(digits) + " "
            + v[2].toFixed(digits));
    };
};

// a method to generate lookat matrix
// taken from http://learnwebgl.brown37.net/lib/learn_webgl_matrix.js because mat4.lookat seems buggy
lookAt = function (M, eye_x, eye_y, eye_z, center_x, center_y, center_z, up_dx, up_dy, up_dz) {

    // Local coordinate system for the camera:
    //   u maps to the x-axis
    //   v maps to the y-axis
    //   n maps to the z-axis

    V.set(center, center_x, center_y, center_z);
    V.set(eye, eye_x, eye_y, eye_z);
    V.set(up, up_dx, up_dy, up_dz);

    V.subtract(n, eye, center);  // n = eye - center
    V.normalize(n);

    V.crossProduct(u, up, n);
    V.normalize(u);

    V.crossProduct(v, n, u);
    V.normalize(v);

    var tx = - V.dotProduct(u, eye);
    var ty = - V.dotProduct(v, eye);
    var tz = - V.dotProduct(n, eye);

    // Set the camera matrix
    M[0] = u[0]; M[4] = u[1]; M[8] = u[2]; M[12] = tx;
    M[1] = v[0]; M[5] = v[1]; M[9] = v[2]; M[13] = ty;
    M[2] = n[0]; M[6] = n[1]; M[10] = n[2]; M[14] = tz;
    M[3] = 0; M[7] = 0; M[11] = 0; M[15] = 1;
};

var V = new Vector3();
var center = V.create();
var eye = V.create();
var up = V.create();
var u = V.create();
var v = V.create();
var n = V.create();

/**
 * 
 * Draw shadow and scene
 * 
 * */

function drawShadowMap(side) {
    var centers = [
        1.0, 0.0, 0.0, //positive x
        -1.0, 0.0, 0.0, //negative x
        0.0, 1.0, 0.0, //positive y
        0.0, -1.0, 0.0, //negative y
        0.0, 0.0, 1.0, //positive z
        0.0, 0.0, -1.0, //negative z
    ];

    var upVectors = [
        0.0, -1.0, 0.0, //positive x
        0.0, -1.0, 0.0, //negative x
        0.0, 0.0, 1.0, //positive y
        0.0, 0.0, -1.0, //negative y
        0.0, -1.0, 0.0, //positive z
        0.0, -1.0, 0.0, //negative z
    ];
    gl.useProgram(shadowMapShaderProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFrameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + side, shadowFrameBuffer.depthBuffer, 0);

    gl.viewport(0, 0, shadowFrameBuffer.width, shadowFrameBuffer.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    shadowMapLookAtMatrix = mat4.create();
    lookAt(shadowMapLookAtMatrix,
        parseFloat(document.getElementById("lightPositionX").value / 10.0),
        parseFloat(document.getElementById("lightPositionY").value / 10.0),
        parseFloat(document.getElementById("lightPositionZ").value / 10.0),
        parseFloat(document.getElementById("lightPositionX").value / 10.0) + centers[side * 3],
        parseFloat(document.getElementById("lightPositionY").value / 10.0) + centers[side * 3 + 1],
        parseFloat(document.getElementById("lightPositionZ").value / 10.0) + centers[side * 3 + 2],
        upVectors[side * 3],
        upVectors[side * 3 + 1],
        upVectors[side * 3 + 2]);
    mat4.perspective(90, shadowFrameBuffer.width / shadowFrameBuffer.height, 0.1, 100.0, shadowMapTransform);
    mat4.multiply(shadowMapTransform, shadowMapLookAtMatrix);
    mat4.set(shadowMapTransform, pMatrix);

    gl.uniform3f(
        shadowMapShaderProgram.pointLightingLocationUniform,
        parseFloat(document.getElementById("lightPositionX").value / 10.0),
        parseFloat(document.getElementById("lightPositionY").value / 10.0),
        parseFloat(document.getElementById("lightPositionZ").value / 10.0)
    );
    gl.uniform1f(shadowMapShaderProgram.uFarPlaneUniform, 100.0);

    mat4.identity(mvMatrix);
    traverse(roomNode, true);
    mat4.translate(mvMatrix, [0, 0, -20]);
    traverse(baseArmNode, true);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function drawScene() {
    lookAtMatrix = mat4.create();
    gl.useProgram(shaderProgram);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    pMatrix = mat4.create();
    if (lookAtMatrixSettings == 0) {
        checkDefault = 0;
        checkObjek1 = 0;
        checkObjek2 = 0;
        document.getElementById("cameraPositionX").disabled = false;
        document.getElementById("cameraPositionY").disabled = false;
        document.getElementById("cameraPositionZ").disabled = false;
        document.getElementById("cameraAngleX").disabled = false;
        document.getElementById("cameraAngleY").disabled = false;
        document.getElementById("cameraAngleZ").disabled = false;
        lookAt(lookAtMatrix,
            0.0, 0.0, 0.0,
            0.0, 0.0, -10.0,
            0.0, 1.0, 0.0);
    } else if (lookAtMatrixSettings == 1) {
        if (checkDefault == 0) {
            lookAtMatrixXPosition = 0;
            lookAtMatrixYPosition = 0;
            lookAtMatrixZPosition = 0;
            lookAtMatrixXAngle = 0;
            lookAtMatrixYAngle = 0;
            lookAtMatrixZAngle = 0;
            checkObjek1 = 0;
            checkObjek2 = 0;
            checkDefault = 1;
        }
        document.getElementById("cameraPositionX").disabled = false;
        document.getElementById("cameraPositionY").disabled = false;
        document.getElementById("cameraPositionZ").disabled = false;
        document.getElementById("cameraAngleX").disabled = true;
        document.getElementById("cameraAngleY").disabled = true;
        document.getElementById("cameraAngleZ").disabled = true;
        lookAt(lookAtMatrix,
            0.0, 0.0, 0.0,
            0.0, 0.0, -10.0,
            0.0, 1.0, 0.0);
    }
    else {
        if (lookAtMatrixSettings == 2) {

            if (checkObjek1 == 0) {
                lookAtMatrixXPosition = 1;
                lookAtMatrixYPosition = 0;
                lookAtMatrixZPosition = 10;
                lookAtMatrixXAngle = 0;
                lookAtMatrixYAngle = 0.3;
                lookAtMatrixZAngle = 0;
                checkObjek1 = 1;
                checkObjek2 = 0;
                checkDefault = 0;
            }
            lookAt(lookAtMatrix,
                3.0, 5.0, -8.0,
                0.0, 0.0, -10.0,
                0.0, 1.0, 0.0);

        }
        if (lookAtMatrixSettings == 3) {

            if (checkObjek2 == 0) {
                lookAtMatrixXPosition = 9;
                lookAtMatrixYPosition = 5.2;
                lookAtMatrixZPosition = 13;
                lookAtMatrixXAngle = -0.1;
                lookAtMatrixYAngle = 0.3;
                lookAtMatrixZAngle = 0;
                checkObjek1 = 0;
                checkObjek2 = 1;
                checkDefault = 0;

            }
            lookAt(lookAtMatrix,
                3.0, 5.0, 10.0,
                0.0, 0.0, -10.0,
                0.0, 1.0, 0.0);

        }
        document.getElementById("cameraAngleX").disabled = true;
        document.getElementById("cameraAngleY").disabled = true;
        document.getElementById("cameraAngleZ").disabled = true;
        document.getElementById("cameraPositionX").disabled = true;
        document.getElementById("cameraPositionY").disabled = true;
        document.getElementById("cameraPositionZ").disabled = true;

    }

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.translate(lookAtMatrix, [lookAtMatrixXPosition, lookAtMatrixYPosition, lookAtMatrixZPosition])
    mat4.rotate(lookAtMatrix, lookAtMatrixXAngle, [1.0, 0.0, 0.0])
    mat4.rotate(lookAtMatrix, lookAtMatrixYAngle, [0.0, 1.0, 0.0])
    mat4.rotate(lookAtMatrix, lookAtMatrixZAngle, [0.0, 0.0, 1.0])
    mat4.multiply(pMatrix, lookAtMatrix);


    gl.uniform1i(shaderProgram.useLightingUniform, document.getElementById("lighting").checked);
    gl.uniform1i(shaderProgram.useTextureUniform, document.getElementById("texture").checked);

    gl.uniform3f(
        shaderProgram.ambientColorUniform,
        parseFloat(document.getElementById("ambientR").value),
        parseFloat(document.getElementById("ambientG").value),
        parseFloat(document.getElementById("ambientB").value)
    );
    gl.uniform3f(
        shaderProgram.pointLightingLocationUniform,
        parseFloat(document.getElementById("lightPositionX").value / 10.0),
        parseFloat(document.getElementById("lightPositionY").value / 10.0),
        parseFloat(document.getElementById("lightPositionZ").value / 10.0)
    );
    gl.uniform3f(
        shaderProgram.pointLightingDiffuseColorUniform,
        parseFloat(document.getElementById("pointR").value),
        parseFloat(document.getElementById("pointG").value),
        parseFloat(document.getElementById("pointB").value)
    );
    gl.uniform3f(
        shaderProgram.pointLightingSpecularColorUniform,
        parseFloat(document.getElementById("pointR").value),
        parseFloat(document.getElementById("pointG").value),
        parseFloat(document.getElementById("pointB").value)
    );

    gl.activeTexture(gl.TEXTURE31);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowFrameBuffer.depthBuffer);
    gl.uniform1i(shaderProgram.shadowMapUniform, 31);

    gl.uniform1f(shaderProgram.uFarPlaneUniform, 100.0);

    mat4.identity(mvMatrix);
    traverse(lightSourceNode, false);
    traverse(roomNode, false);

    mat4.translate(mvMatrix, [0, 0, -20]);
    traverse(baseArmNode, false);

}


/**
    * 
    * Animate objects
    * 
    * */


function animate() {
    if (animating) {
        //var update = (0.05 * Math.PI * (timeNow - lastTime)/ 180); //use elapsed time, which is faulty on changing tabs
        var update = (0.05 * Math.PI * 10 / 180);

        //Arm
        baseArmAngle = (baseArmAngle + update) % (2 * Math.PI);
        document.getElementById("baseArmRotationSlider").value = baseArmAngle * 180 / (Math.PI);

        secondArmAngle += update * secondArmDirection;
        if (secondArmAngle < 0 && secondArmDirection == -1) secondArmDirection *= -1;
        if (secondArmAngle > Math.PI / 2 && secondArmDirection == 1) secondArmDirection *= -1;
        document.getElementById("secondArmRotationSlider").value = secondArmAngle * 180 / (Math.PI);

        palmAngle = (palmAngle + update) % (2 * Math.PI);
        document.getElementById("palmRotationSlider").value = palmAngle * 180 / (Math.PI);

        firstFingerBaseAngle += update * firstFingerBaseDirection;
        if (firstFingerBaseAngle < -Math.PI / 4 && firstFingerBaseDirection == -1) firstFingerBaseDirection *= -1;
        if (firstFingerBaseAngle > Math.PI / 8 && firstFingerBaseDirection == 1) firstFingerBaseDirection *= -1;
        document.getElementById("firstFingerBaseRotationSlider").value = firstFingerBaseAngle * 180 / (Math.PI);

        firstFingerTopAngle += update * firstFingerTopDirection;
        if (firstFingerTopAngle < 0 && firstFingerTopDirection == -1) firstFingerTopDirection *= -1;
        if (firstFingerTopAngle > Math.PI / 8 && firstFingerTopDirection == 1) firstFingerTopDirection *= -1;
        document.getElementById("firstFingerTopRotationSlider").value = firstFingerTopAngle * 180 / (Math.PI);

        secondFingerBaseAngle += update * secondFingerBaseDirection;
        if (secondFingerBaseAngle < -Math.PI / 4 && secondFingerBaseDirection == -1) secondFingerBaseDirection *= -1;
        if (secondFingerBaseAngle > Math.PI / 8 && secondFingerBaseDirection == 1) secondFingerBaseDirection *= -1;
        document.getElementById("secondFingerBaseRotationSlider").value = secondFingerBaseAngle * 180 / (Math.PI);

        secondFingerTopAngle += update * secondFingerTopDirection;
        if (secondFingerTopAngle < 0 && secondFingerTopDirection == -1) secondFingerTopDirection *= -1;
        if (secondFingerTopAngle > Math.PI / 8 && secondFingerTopDirection == 1) secondFingerTopDirection *= -1;
        document.getElementById("secondFingerTopRotationSlider").value = secondFingerTopAngle * 180 / (Math.PI);

        thirdFingerBaseAngle += update * thirdFingerBaseDirection;
        if (thirdFingerBaseAngle < -Math.PI / 4 && thirdFingerBaseDirection == -1) thirdFingerBaseDirection *= -1;
        if (thirdFingerBaseAngle > Math.PI / 8 && thirdFingerBaseDirection == 1) thirdFingerBaseDirection *= -1;
        document.getElementById("thirdFingerBaseRotationSlider").value = thirdFingerBaseAngle * 180 / (Math.PI);

        thirdFingerTopAngle += update * thirdFingerTopDirection;
        if (thirdFingerTopAngle < 0 && thirdFingerTopDirection == -1) thirdFingerTopDirection *= -1;
        if (thirdFingerTopAngle > Math.PI / 8 && thirdFingerTopDirection == 1) thirdFingerTopDirection *= -1;
        document.getElementById("thirdFingerTopRotationSlider").value = thirdFingerTopAngle * 180 / (Math.PI);

        //Camera
        baseCameraAngle = (baseCameraAngle + update) % (2 * Math.PI);
        document.getElementById("baseCameraRotationSlider").value = baseCameraAngle * 180 / (Math.PI);

        firstCameraLegAngle += update * firstCameraLegDirection;
        if (firstCameraLegAngle < 0 && firstCameraLegDirection == -1) firstCameraLegDirection *= -1;
        if (firstCameraLegAngle > Math.PI / 4 && firstCameraLegDirection == 1) firstCameraLegDirection *= -1;
        document.getElementById("firstCameraLegRotationSlider").value = firstCameraLegAngle * 180 / (Math.PI);

        secondCameraLegAngle += update * secondCameraLegDirection;
        if (secondCameraLegAngle < 0 && secondCameraLegDirection == -1) secondCameraLegDirection *= -1;
        if (secondCameraLegAngle > Math.PI / 4 && secondCameraLegDirection == 1) secondCameraLegDirection *= -1;
        document.getElementById("secondCameraLegRotationSlider").value = secondCameraLegAngle * 180 / (Math.PI);

        thirdCameraLegAngle += update * thirdCameraLegDirection;
        if (thirdCameraLegAngle < 0 && thirdCameraLegDirection == -1) thirdCameraLegDirection *= -1;
        if (thirdCameraLegAngle > Math.PI / 4 && thirdCameraLegDirection == 1) thirdCameraLegDirection *= -1;
        document.getElementById("thirdCameraLegRotationSlider").value = thirdCameraLegAngle * 180 / (Math.PI);

        secondCameraBodyTranslation += 0.5 * update * secondCameraBodyDirection;
        if (secondCameraBodyTranslation < 0.05 && secondCameraBodyDirection == -1) secondCameraBodyDirection *= -1;
        if (secondCameraBodyTranslation > 0.3 && secondCameraBodyDirection == 1) secondCameraBodyDirection *= -1;
        document.getElementById("secondCameraBodyTranslationSlider").value = secondCameraBodyTranslation * 100;

        thirdCameraBodyTranslation += 0.5 * update * thirdCameraBodyDirection;
        if (thirdCameraBodyTranslation < 0.05 && thirdCameraBodyDirection == -1) thirdCameraBodyDirection *= -1;
        if (thirdCameraBodyTranslation > 0.2 && thirdCameraBodyDirection == 1) thirdCameraBodyDirection *= -1;
        document.getElementById("thirdCameraBodyTranslationSlider").value = thirdCameraBodyTranslation * 100;

        fourthCameraBodyTranslation += 0.5 * update * fourthCameraBodyDirection;
        if (fourthCameraBodyTranslation < 0.05 && fourthCameraBodyDirection == -1) fourthCameraBodyDirection *= -1;
        if (fourthCameraBodyTranslation > 0.2 && fourthCameraBodyDirection == 1) fourthCameraBodyDirection *= -1;
        document.getElementById("fourthCameraBodyTranslationSlider").value = fourthCameraBodyTranslation * 100;

        lensCameraTranslation += 0.5 * update * lensCameraDirection;
        if (lensCameraTranslation < 0.1 && lensCameraDirection == -1) lensCameraDirection *= -1;
        if (lensCameraTranslation > 0.25 && lensCameraDirection == 1) lensCameraDirection *= -1;
        document.getElementById("lensCameraTranslationSlider").value = lensCameraTranslation * 100;

        shutterCameraTranslation += 0.5 * update * shutterCameraDirection;
        if (shutterCameraTranslation < 0.45 && shutterCameraDirection == -1) shutterCameraDirection *= -1;
        if (shutterCameraTranslation > Math.PI / 4 && shutterCameraDirection == 1) shutterCameraDirection *= -1;
        document.getElementById("shutterCameraTranslationSlider").value = shutterCameraTranslation * 100;

        //Duck
        baseDuckBodyAngle = (baseDuckBodyAngle + update) % (2 * Math.PI);
        document.getElementById("baseDuckBodySlider").value = baseCameraAngle * 180 / (Math.PI);

        baseDuckNeckAngle += update * baseDuckNeckDirection;
        if (baseDuckNeckAngle < 1.6 && baseDuckNeckDirection == -1) baseDuckNeckDirection *= -1;
        if (baseDuckNeckAngle > 2.7 && baseDuckNeckDirection == 1) baseDuckNeckDirection *= -1;
        document.getElementById("baseDuckNeckSlider").value = baseDuckNeckAngle * 180 / (Math.PI);

        baseDuckHeadAngle += update * baseDuckHeadDirection;
        if (baseDuckHeadAngle < 0.8 && baseDuckHeadDirection == -1) baseDuckHeadDirection *= -1;
        if (baseDuckHeadAngle > 1.5 && baseDuckHeadDirection == 1) baseDuckHeadDirection *= -1;
        document.getElementById("baseDuckHeadSlider").value = baseDuckHeadAngle * 180 / (Math.PI);

        baseDuckFirstWingAngle += update * baseDuckFirstWingDirection;
        if (baseDuckFirstWingAngle < 5.7 && baseDuckFirstWingDirection == -1) baseDuckFirstWingDirection *= -1;
        if (baseDuckFirstWingAngle > 6.0 && baseDuckFirstWingDirection == 1) baseDuckFirstWingDirection *= -1;
        document.getElementById("baseDuckFirstWingSlider").value = baseDuckFirstWingAngle * 180 / (Math.PI);

        baseDuckSecondWingAngle += update * baseDuckSecondWingDirection;
        if (baseDuckSecondWingAngle < 4.2 && baseDuckSecondWingDirection == -1) baseDuckSecondWingDirection *= -1;
        if (baseDuckSecondWingAngle > 4.4 && baseDuckSecondWingDirection == 1) baseDuckSecondWingDirection *= -1;
        document.getElementById("baseDuckSecondWingSlider").value = baseDuckSecondWingAngle * 180 / (Math.PI);

        baseDuckFirstUpAngle += update * baseDuckFirstUpDirection;
        if (baseDuckFirstUpAngle < 0.8 && baseDuckFirstUpDirection == -1) baseDuckFirstUpDirection *= -1;
        if (baseDuckFirstUpAngle > 2.4 && baseDuckFirstUpDirection == 1) baseDuckFirstUpDirection *= -1;
        document.getElementById("baseDuckFirstUpSlider").value = baseDuckFirstUpAngle * 180 / (Math.PI);

        baseDuckSecondUpAngle += update * baseDuckSecondUpDirection;
        if (baseDuckSecondUpAngle < 0.8 && baseDuckSecondUpDirection == -1) baseDuckSecondUpDirection *= -1;
        if (baseDuckSecondUpAngle > 2.4 && baseDuckSecondUpDirection == 1) baseDuckSecondUpDirection *= -1;
        document.getElementById("baseDuckSecondUpSlider").value = baseDuckSecondUpAngle * 180 / (Math.PI);

        baseDuckFirstDownAngle += update * baseDuckFirstDownDirection;
        if (baseDuckFirstDownAngle < 2 && baseDuckFirstDownDirection == -1) baseDuckFirstDownDirection *= -1;
        if (baseDuckFirstDownAngle > 2.1 && baseDuckFirstDownDirection == 1) baseDuckFirstDownDirection *= -1;
        document.getElementById("baseDuckFirstDownSlider").value = baseDuckFirstDownAngle * 180 / (Math.PI);

        baseDuckSecondDownAngle += update * baseDuckSecondDownDirection;
        if (baseDuckSecondDownAngle < 1.6 && baseDuckSecondDownDirection == -1) baseDuckSecondDownDirection *= -1;
        if (baseDuckSecondDownAngle > 2.1 && baseDuckSecondDownDirection == 1) baseDuckSecondDownDirection *= -1;
        document.getElementById("baseDuckSecondDownSlider").value = baseDuckSecondDownAngle * 180 / (Math.PI);

        //SnowMan
        baseSnowManx += update * baseSnowManxDirection;
        if (baseSnowManx < -1 && baseSnowManxDirection == -1) baseSnowManxDirection *= -1;
        if (baseSnowManx > 1 && baseSnowManxDirection == 1) baseSnowManxDirection *= -1;
        document.getElementById("SnowManPositionX").value = baseSnowManx;

        baseSnowMany += update * baseSnowManyDirection;
        if (baseSnowMany < -1 && baseSnowManyDirection == -1) baseSnowManyDirection *= -1;
        if (baseSnowMany > 1 && baseSnowManyDirection == 1) baseSnowManyDirection *= -1;
        document.getElementById("SnowManPositionY").value = baseSnowMany;

        baseSnowManz += update * baseSnowManzDirection;
        if (baseSnowManz < -1 && baseSnowManzDirection == -1) baseSnowManzDirection *= -1;
        if (baseSnowManz > 1 && baseSnowManzDirection == 1) baseSnowManzDirection *= -1;
        document.getElementById("SnowManPositionZ").value = baseSnowManz;

        baseSnowManAngle += update * baseSnowManAngleDirection;
        if (baseSnowManAngle < -1 && baseSnowManAngleDirection == -1) baseSnowManAngleDirection *= -1;
        if (baseSnowManAngle > 1 && baseSnowManAngleDirection == 1) baseSnowManAngleDirection *= -1;

        //Dog
        baseDogXAngle += update * baseDogXAngleDirection;
        if (baseDogXAngle < 0 && baseDogXAngleDirection == -1) baseDogXAngleDirection *= -1;
        if (baseDogXAngle > Math.PI && baseDogXAngleDirection == 1) baseDogXAngleDirection *= -1;
        document.getElementById("DogAngleX").value = baseDogXAngle * 180 / (Math.PI);

        baseDogYAngle += update * baseDogYAngleDirection;
        if (baseDogYAngle < 0 && baseDogYAngleDirection == -1) baseDogYAngleDirection *= -1;
        if (baseDogYAngle > Math.PI && baseDogYAngleDirection == 1) baseDogYAngleDirection *= -1;
        document.getElementById("DogAngleY").value = baseDogYAngle * 180 / (Math.PI);

        baseDogZAngle += update * baseDogZAngleDirection;
        if (baseDogZAngle < 0 && baseDogZAngleDirection == -1) baseDogZAngleDirection *= -1;
        if (baseDogZAngle > Math.PI && baseDogZAngleDirection == 1) baseDogZAngleDirection *= -1;
        document.getElementById("DogAngleZ").value = baseDogZAngle * 180 / (Math.PI);


        baseDogX += update * baseDogXDirection;
        if (baseDogX < -1 && baseDogXDirection == -1) baseDogXDirection *= -1;
        if (baseDogX > 7 && baseDogXDirection == 1) baseDogXDirection *= -1;
        document.getElementById("DogPositionX").value = baseDogX * 10;

        baseDogY += update * baseDogYDirection;
        if (baseDogY < -1.5 && baseDogYDirection == -1) baseDogYDirection *= -1;
        if (baseDogY > 1.5 && baseDogYDirection == 1) baseDogYDirection *= -1;
        document.getElementById("DogPositionY").value = baseDogY * 10;

        baseDogZ += update * baseDogZDirection;
        if (baseDogZ < -2 && baseDogZDirection == -1) baseDogZDirection *= -1;
        if (baseDogZ > 2 && baseDogZDirection == 1) baseDogZDirection *= -1;
        document.getElementById("DogPositionZ").value = baseDogZ * 10;

    }

    initObjectTree();
}

function tick() {
    requestAnimationFrame(tick);
    for (var i = 0; i < 6; i++) {
        drawShadowMap(i);
    }
    drawScene();
    animate();
}

/**
    * 
    * Init for inputs
    * 
    * */

function initInputs() {
    document.getElementById("animation").checked = true;
    document.getElementById("lighting").checked = true;
    document.getElementById("texture").checked = false;
    document.getElementById("animation").onchange = function () {
        animating ^= 1;
        if (animating) {
            document.getElementById("baseArmRotationSlider").disabled = true;
            document.getElementById("secondArmRotationSlider").disabled = true;
            document.getElementById("palmRotationSlider").disabled = true;
            document.getElementById("firstFingerBaseRotationSlider").disabled = true;
            document.getElementById("firstFingerTopRotationSlider").disabled = true;
            document.getElementById("secondFingerBaseRotationSlider").disabled = true;
            document.getElementById("secondFingerTopRotationSlider").disabled = true;
            document.getElementById("thirdFingerBaseRotationSlider").disabled = true;
            document.getElementById("thirdFingerTopRotationSlider").disabled = true;
            document.getElementById("baseCameraRotationSlider").disabled = true;
            document.getElementById("firstCameraLegRotationSlider").disabled = true;
            document.getElementById("secondCameraLegRotationSlider").disabled = true;
            document.getElementById("thirdCameraLegRotationSlider").disabled = true;
            document.getElementById("secondCameraBodyTranslationSlider").disabled = true;
            document.getElementById("thirdCameraBodyTranslationSlider").disabled = true;
            document.getElementById("fourthCameraBodyTranslationSlider").disabled = true;
            document.getElementById("lensCameraTranslationSlider").disabled = true;
            document.getElementById("shutterCameraTranslationSlider").disabled = true;
            document.getElementById("baseDuckNeckSlider").disabled = true;
            document.getElementById("baseDuckFirstUpSlider").disabled = true;
            document.getElementById("baseDuckFirstDownSlider").disabled = true;
            document.getElementById("baseDuckSecondUpSlider").disabled = true;
            document.getElementById("baseDuckSecondDownSlider").disabled = true;
            document.getElementById("baseDuckFirstWingSlider").disabled = true;
            document.getElementById("baseDuckSecondWingSlider").disabled = true;
            document.getElementById("baseDuckBodySlider").disabled = true;
            document.getElementById("baseDuckHeadSlider").disabled = true;
            document.getElementById("SnowManPositionX").disabled = true;
            document.getElementById("SnowManPositionY").disabled = true;
            document.getElementById("SnowManPositionZ").disabled = true;
            document.getElementById("DogPositionX").disabled = true;
            document.getElementById("DogPositionY").disabled = true;
            document.getElementById("DogPositionZ").disabled = true;
            document.getElementById("DogAngleX").disabled = true;
            document.getElementById("DogAngleY").disabled = true;
            document.getElementById("DogAngleZ").disabled = true;
        } else {
            document.getElementById("baseArmRotationSlider").disabled = false;
            document.getElementById("secondArmRotationSlider").disabled = false;
            document.getElementById("palmRotationSlider").disabled = false;
            document.getElementById("firstFingerBaseRotationSlider").disabled = false;
            document.getElementById("firstFingerTopRotationSlider").disabled = false;
            document.getElementById("secondFingerBaseRotationSlider").disabled = false;
            document.getElementById("secondFingerTopRotationSlider").disabled = false;
            document.getElementById("thirdFingerBaseRotationSlider").disabled = false;
            document.getElementById("thirdFingerTopRotationSlider").disabled = false;
            document.getElementById("baseCameraRotationSlider").disabled = false;
            document.getElementById("firstCameraLegRotationSlider").disabled = false;
            document.getElementById("secondCameraLegRotationSlider").disabled = false;
            document.getElementById("thirdCameraLegRotationSlider").disabled = false;
            document.getElementById("secondCameraBodyTranslationSlider").disabled = false;
            document.getElementById("thirdCameraBodyTranslationSlider").disabled = false;
            document.getElementById("fourthCameraBodyTranslationSlider").disabled = false;
            document.getElementById("lensCameraTranslationSlider").disabled = false;
            document.getElementById("shutterCameraTranslationSlider").disabled = false;
            document.getElementById("baseDuckNeckSlider").disabled = false;
            document.getElementById("baseDuckFirstUpSlider").disabled = false;
            document.getElementById("baseDuckFirstDownSlider").disabled = false;
            document.getElementById("baseDuckSecondUpSlider").disabled = false;
            document.getElementById("baseDuckSecondDownSlider").disabled = false;
            document.getElementById("baseDuckFirstWingSlider").disabled = false;
            document.getElementById("baseDuckSecondWingSlider").disabled = false;
            document.getElementById("baseDuckBodySlider").disabled = false;
            document.getElementById("baseDuckHeadSlider").disabled = false;
            document.getElementById("SnowManPositionX").disabled = false;
            document.getElementById("SnowManPositionY").disabled = false;
            document.getElementById("SnowManPositionZ").disabled = false;
            document.getElementById("DogPositionX").disabled = false;
            document.getElementById("DogPositionY").disabled = false;
            document.getElementById("DogPositionZ").disabled = false;
            document.getElementById("DogAngleX").disabled = false;
            document.getElementById("DogAngleY").disabled = false;
            document.getElementById("DogAngleZ").disabled = false;

        }
    };
    document.getElementById("baseArmRotationSlider").oninput = function () {
        baseArmAngle = document.getElementById("baseArmRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("secondArmRotationSlider").oninput = function () {
        secondArmAngle = document.getElementById("secondArmRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("palmRotationSlider").oninput = function () {
        palmAngle = document.getElementById("palmRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("firstFingerBaseRotationSlider").oninput = function () {
        firstFingerBaseAngle = document.getElementById("firstFingerBaseRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("firstFingerTopRotationSlider").oninput = function () {
        firstFingerTopAngle = document.getElementById("firstFingerTopRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("secondFingerBaseRotationSlider").oninput = function () {
        secondFingerBaseAngle = document.getElementById("secondFingerBaseRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("secondFingerTopRotationSlider").oninput = function () {
        secondFingerTopAngle = document.getElementById("secondFingerTopRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("thirdFingerBaseRotationSlider").oninput = function () {
        thirdFingerBaseAngle = document.getElementById("thirdFingerBaseRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("thirdFingerTopRotationSlider").oninput = function () {
        thirdFingerTopAngle = document.getElementById("thirdFingerTopRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("baseCameraRotationSlider").oninput = function () {
        baseCameraAngle = document.getElementById("baseCameraRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("firstCameraLegRotationSlider").oninput = function () {
        firstCameraLegAngle = document.getElementById("firstCameraLegRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("secondCameraLegRotationSlider").oninput = function () {
        secondCameraLegAngle = document.getElementById("secondCameraLegRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("thirdCameraLegRotationSlider").oninput = function () {
        thirdCameraLegAngle = document.getElementById("thirdCameraLegRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("secondCameraBodyTranslationSlider").oninput = function () {
        thirdCameraLegAngle = document.getElementById("thirdCameraLegRotationSlider").value * Math.PI / 180;
    }
    document.getElementById("secondCameraBodyTranslationSlider").oninput = function () {
        secondCameraBodyTranslation = document.getElementById("secondCameraBodyTranslationSlider").value / 100;
    }
    document.getElementById("thirdCameraBodyTranslationSlider").oninput = function () {
        thirdCameraBodyTranslation = document.getElementById("thirdCameraBodyTranslationSlider").value / 100;
    }
    document.getElementById("fourthCameraBodyTranslationSlider").oninput = function () {
        fourthCameraBodyTranslation = document.getElementById("fourthCameraBodyTranslationSlider").value / 100;
    }
    document.getElementById("lensCameraTranslationSlider").oninput = function () {
        lensCameraTranslation = document.getElementById("lensCameraTranslationSlider").value / 100;
    }
    document.getElementById("shutterCameraTranslationSlider").oninput = function () {
        shutterCameraTranslation = document.getElementById("shutterCameraTranslationSlider").value / 100;
    }
    document.getElementById("arm-material").onchange = function () {
        armMaterial = document.getElementById("arm-material").value;
    }
    document.getElementById("camera-material").onchange = function () {
        cameraMaterial = document.getElementById("camera-material").value;
    }
    document.getElementById("room-material").onchange = function () {
        roomMaterial = document.getElementById("room-material").value;
    }
    document.getElementById("camera-setting").onchange = function () {
        lookAtMatrixSettings = document.getElementById("camera-setting").value;
    }
    document.getElementById("Duck-material").onchange = function () {
        DuckMaterial = document.getElementById("Duck-material").value;
    }
    document.getElementById("SnowMan-material").onchange = function () {
        SnowManMaterial = document.getElementById("SnowMan-material").value;
    }
    document.getElementById("Dog-material").onchange = function () {
        DogMaterial = document.getElementById("Dog-material").value;
    }
    document.getElementById("baseDuckBodySlider").oninput = function () {
        baseDuckBodyAngle = document.getElementById("baseDuckBodySlider").value * Math.PI / 180;
    }
    document.getElementById("baseDuckNeckSlider").oninput = function () {
        baseDuckNeckAngle = document.getElementById("baseDuckNeckSlider").value * Math.PI / 180;
    }
    document.getElementById("baseDuckFirstUpSlider").oninput = function () {
        baseDuckFirstUpAngle = document.getElementById("baseDuckFirstUpSlider").value * Math.PI / 180;
    }
    document.getElementById("baseDuckFirstDownSlider").oninput = function () {
        baseDuckFirstDownAngle = document.getElementById("baseDuckFirstDownSlider").value * Math.PI / 180;
    }
    document.getElementById("baseDuckSecondUpSlider").oninput = function () {
        baseDuckSecondUpAngle = document.getElementById("baseDuckSecondUpSlider").value * Math.PI / 180;
    }
    document.getElementById("baseDuckSecondDownSlider").oninput = function () {
        baseDuckSecondDownAngle = document.getElementById("baseDuckSecondDownSlider").value * Math.PI / 180;
    }
    document.getElementById("baseDuckFirstWingSlider").oninput = function () {
        baseDuckFirstWingAngle = document.getElementById("baseDuckFirstWingSlider").value * Math.PI / 180;
    }
    document.getElementById("baseDuckSecondWingSlider").oninput = function () {
        baseDuckSecondWingAngle = document.getElementById("baseDuckSecondWingSlider").value * Math.PI / 180;
    }
    document.getElementById("baseDuckHeadSlider").oninput = function () {
        baseDuckHeadAngle = document.getElementById("baseDuckHeadSlider").value * Math.PI / 180;
    }
    document.getElementById("SnowManPositionX").oninput = function () {
        baseSnowManx = document.getElementById("SnowManPositionX").value / 10;
    }
    document.getElementById("SnowManPositionY").oninput = function () {
        baseSnowMany = document.getElementById("SnowManPositionY").value / 10;
    }
    document.getElementById("SnowManPositionZ").oninput = function () {
        baseSnowManz = document.getElementById("SnowManPositionZ").value / 10;
    }
    document.getElementById("DogPositionX").oninput = function () {
        baseDogX = document.getElementById("DogPositionX").value / 10;
    }
    document.getElementById("DogPositionY").oninput = function () {
        baseDogY = document.getElementById("DogPositionY").value / 10;
    }
    document.getElementById("DogPositionZ").oninput = function () {
        baseDogZ = document.getElementById("DogPositionZ").value / 10;
    }
    document.getElementById("DogAngleX").oninput = function () {
        baseDogXAngle = document.getElementById("DogAngleX").value * Math.PI / 180;
    }
    document.getElementById("DogAngleY").oninput = function () {
        baseDogYAngle = document.getElementById("DogAngleY").value * Math.PI / 180;
    }
    document.getElementById("DogAngleZ").oninput = function () {
        baseDogZAngle = document.getElementById("DogAngleZ").value * Math.PI / 180;
    }
    document.getElementById("cameraPositionX").oninput = function () {
        lookAtMatrixXPosition = document.getElementById("cameraPositionX").value / 10;
    }
    document.getElementById("cameraPositionY").oninput = function () {
        lookAtMatrixYPosition = document.getElementById("cameraPositionY").value / 10;
    }
    document.getElementById("cameraPositionZ").oninput = function () {
        lookAtMatrixZPosition = document.getElementById("cameraPositionZ").value / 10;
    }
    document.getElementById("cameraAngleX").oninput = function () {
        lookAtMatrixXAngle = document.getElementById("cameraAngleX").value * Math.PI / 180;
    }
    document.getElementById("cameraAngleY").oninput = function () {
        lookAtMatrixYAngle = document.getElementById("cameraAngleY").value * Math.PI / 180;
    }
    document.getElementById("cameraAngleZ").oninput = function () {
        lookAtMatrixZAngle = document.getElementById("cameraAngleZ").value * Math.PI / 180;
    }
}


/**
* 
* Config texture
* 
* */

//https://gist.github.com/manuel-delverme/3e606eee55e0e7a3db9cc11ba9dc3aac
function configureTexture(image, textureno) {
    var texture = gl.createTexture();
    gl.activeTexture(textureno);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
        gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

}

function initTexture() {
    var image0 = new Image();
    image0.crossOrigin = "anonymous";
    image0.src = "img/arm_texture2.jpg"
    image0.onload = function () {
        configureTexture(image0, gl.TEXTURE0);
    }


    var image1 = new Image();
    image1.crossOrigin = "anonymous";
    image1.onload = function () {
        configureTexture(image1, gl.TEXTURE1);
    }
    image1.src = "img/wall2.jpg"

    var image2 = new Image();
    image2.crossOrigin = "anonymous";
    image2.onload = function () {
        configureTexture(image2, gl.TEXTURE2);
    }
    image2.src = "img/blue.jpg"

    var image3 = new Image();
    image3.crossOrigin = "anonymous";
    image3.onload = function () {
        configureTexture(image3, gl.TEXTURE3);
    }
    image3.src = "img/deep_blue.jpg"

    var image6 = new Image();
    image6.crossOrigin = "anonymous";
    image6.onload = function () {
        configureTexture(image6, gl.TEXTURE6);
    }
    image6.src = "img/black.jpg"

    var image7 = new Image();
    image7.crossOrigin = "anonymous";
    image7.onload = function () {
        configureTexture(image7, gl.TEXTURE7);
    }
    image7.src = "img/red.jpg"

    var image8 = new Image();
    image8.crossOrigin = "anonymous";
    image8.onload = function () {
        configureTexture(image8, gl.TEXTURE8);
    }
    image8.src = "img/glass.jpg"
}

/**
* 
* Start the program
* 
* */

function webGLStart() {
    var canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight * 0.9;
    canvas.width = window.innerWidth;
    armMaterial = document.getElementById("arm-material").value;
    cameraMaterial = document.getElementById("camera-material").value;
    DuckMaterial = document.getElementById("Duck-material").value;;
    SnowManMaterial = document.getElementById("SnowMan-material").value;;
    DogMaterial = document.getElementById("Dog-material").value;;
    roomMaterial = document.getElementById("room-material").value;
    initGL(canvas);
    initShaders();
    initBuffers();
    initObjectTree();
    initInputs();
    initTexture();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    initializeAtrributes()
    tick();
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
