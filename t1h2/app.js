import * as dat from './lib/dat.gui/build/dat.gui.module.js';
import * as THREE from './lib/three.js/build/three.module.js';
import Stats from './lib/three.js/examples/jsm/libs/stats.module.js';
import { TrackballControls } from './lib/three.js/examples/jsm/controls/TrackballControls.js';
import { SLJLoader } from './sljloader.js';

var loader = new THREE.FileLoader().setResponseType('json');
var sljloader = new SLJLoader();
var manifest;
var selector;

var showStats = true;
var container, stats;
var controls;
var camera, cameraTarget, scene, renderer;
var particleMaterial;
var particleCloud;

var settings = new Settings();
function Settings() {
    this.particleSize = 0.1;
    this.particleAlpha = 1.0;
    this.minLogNorm = 0.0;
    this.maxLogNorm = 15.0;
    this.insideOutside = 0.0;
    this.particleSizeListener = null;
    this.dataset = null;
}

init();
animate();

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 10, 5000 );
    camera.position.set( 0,0,250 );
    cameraTarget = new THREE.Vector3( 0, 0, 0 );

    scene.add(camera);

    var uniforms = {
        pointTexture: { value: new THREE.TextureLoader().load( 'textures/sprites/disk.png' ) },
        coordscale: { value: 20.0 },
	    sizescale: { value: window.innerHeight * window.devicePixelRatio * settings.particleSize / 1600.0 },
	    alpha: { value: settings.particleAlpha },
        r4transform: { value: genOutsideInsideMat(0.0)  }
    };
    
    particleMaterial = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
	    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
	    blending: THREE.AdditiveBlending,
	    depthTest: false,
	    transparent: true,
	    vertexColors: true
    } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    
    container.appendChild( renderer.domElement );

    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 3.0;

    if (showStats) {
	    stats = new Stats();
	    container.appendChild( stats.dom );
    }
    
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'keydown', onKeyDown, false);

    window.onload = function() {
	    initStatus();
	    initGUI();
        loadManifest();
        // beginLoadParticleCloud(settings.dataset);
    }
}

// From https://stackoverflow.com/questions/18260307/dat-gui-update-the-dropdown-list-values-for-a-controller
function updateDropdown(target, list){   
    var innerHTMLStr = "";
    for(var i=0; i<list.length; i++){
        var str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
        innerHTMLStr += str;        
    }

    if (innerHTMLStr != "") target.domElement.children[0].innerHTML = innerHTMLStr;
}

function loadManifest() {
    loader.load('data/manifest.json',onHaveManifest);
}

function onHaveManifest(m) {
    // Store the manifest of title->filename mappings
    manifest = m;
    // Put these in the GUI dropdown menu
    var keys = Object.keys(manifest);
    updateDropdown(selector, keys);
    beginLoadParticleCloud(keys[0]);
}

function hideInfoBox() {
    document.getElementById('infobox').style.display = 'none';
}

function showInfoBox() {
    document.getElementById('infobox').style.display = 'block';
}

function infoBoxVisible() {
    return document.getElementById('infobox').style.display != 'none';
}

function hideLoadingBox() {
    document.getElementById('loadingbox').style.display = 'none'; 
}

function showLoadingBox() {
    document.getElementById('loadingmsg').innerHTML = 'Loading...';
    document.getElementById('loadingbox').style.display = 'block'; 
}

function showTransientErrorBox() {
    document.getElementById('loadingmsg').innerHTML = 'Failed to load dataset';
    document.getElementById('loadingbox').style.display = 'block';
    window.setTimeout(function() {
        document.getElementById('loadingbox').style.display = 'none';
    },2000);
}

function genOutsideInsideMat(x) {
    var m = new THREE.Matrix4();
    var c = Math.cos(0.5*Math.PI*(1-x));
    var s = Math.sin(0.5*Math.PI*(1-x));
    m.set(
        1.0, 0.0, 0.0, 0.0,
        0.0,   c, 0.0,  -s,
        0.0, 0.0, 1.0, 0.0,
        0.0,   s, 0.0,   c);
    return m;
}

function initGUI() {
    var gui = new dat.GUI();
    selector=gui.add(settings,'dataset', []).onFinishChange(beginLoadParticleCloud);
    settings.particleSizeListener = gui.add(settings,'particleSize',0.00001,10);
    settings.particleSizeListener.onChange(updateParticleSize);
    gui.add(settings,'particleAlpha',0.0,1.0).onChange(function(x) { particleMaterial.uniforms.alpha.value = x; })
    gui.add(settings,'insideOutside',0.0,1.0).onChange(function(x) { particleMaterial.uniforms.r4transform.value = genOutsideInsideMat(x); })
}    

function initStatus() {
    window.addEventListener('click',function(event){
	if (event.target != document.getElementById("infobutton")) {
	    hideInfoBox();
	}
    });
}

function beginLoadParticleCloud(key) {
    var url="data/".concat(manifest[key]);
    showLoadingBox();
    sljloader.load(
        url,
        finishLoadParticleCloud
    );
}

function finishLoadParticleCloud(content) {
    var positions = [];
    var vecdata = [];

    content.vectors.forEach(function(row,idx) {
        positions.push(row[0]);
        positions.push(row[1]);
        positions.push(row[2]);
        
        vecdata.push(row[3]);
        vecdata.push(content.sizes[idx]);
    });

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).setUsage(THREE.DynamicDrawUsage) );
    geometry.setAttribute( 'vecdatum', new THREE.Float32BufferAttribute( vecdata, 2 ).setUsage(THREE.DynamicDrawUsage) );

    if (particleCloud != null)
    	scene.remove( particleCloud );
    
    particleCloud = new THREE.Points( geometry, particleMaterial );
    scene.add( particleCloud );

    document.getElementById('desc-short').innerHTML = content['shortdesc'];
    document.getElementById('desc-title').innerHTML = content['title'];
    document.getElementById('desc-long').innerHTML = content['longdesc'];

    hideLoadingBox();
}

function onKeyDown(event) {
    var keyCode = event.which;

    // plus
    if (keyCode == 187) {
        setParticleSize( settings.particleSize + 1);
    }

    // minus
    if (keyCode == 189) {
        if (settings.particleSize > 1) {
            setParticleSize( settings.particleSize - 1 );
	    }
    }

    if (keyCode == 27){
	    hideInfoBox();
    }

    if (keyCode == 73) {
	   if (infoBoxVisible()) {
	       hideInfoBox();
	    } else {
	       showInfoBox();
	    }
    }
    
    render();
}

function setParticleSize(x) {
    settings.particleSize = x;
    settings.particleSizeListener.updateDisplay();
    particleMaterial.uniforms.sizescale.value = window.innerHeight * window.devicePixelRatio * settings.particleSize / 1600.0;
}

function updateParticleSize() {
    setParticleSize(settings.particleSize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    updateParticleSize();
}

function animate() {
    requestAnimationFrame( animate );    
    render();
    if (showStats) {
	   stats.update();
    }
    controls.update();
}

function render() {
    camera.lookAt( cameraTarget );
    renderer.render( scene, camera );    
}
