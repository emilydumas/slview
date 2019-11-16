import * as dat from './lib/dat.gui/build/dat.gui.module.js';
import * as THREE from './lib/three.js/build/three.module.js';
import Stats from './lib/three.js/examples/jsm/libs/stats.module.js';
import { TrackballControls } from './lib/three.js/examples/jsm/controls/TrackballControls.js';

const default_dataset = 'psl2z';

const datasets = {
    psl2z: 'data/psl2z-medium.json',
    psl2zbig: 'data/psl2z-big.json',
    psl2ztiny: 'data/psl2z-tiny.json',
    disc6: 'data/disc6.json',
    disc14: 'data/disc14.json',
    ex_hyp1: 'data/ex-hyp1.json',
    ex_hyp2: 'data/ex-hyp2.json',
    ex_hypmany: 'data/ex-hypmany.json',
    ex_parabolics2: 'data/ex-parabolics2.json',
    ex_elliptics1:  'data/ex-elliptics1.json',
    ex_elliptics2:  'data/ex-elliptics2.json',
    ex_ellipticsmany:  'data/ex-ellipticsmany.json',
    ex_halfturns: 'data/ex-halfturns.json',
    ex_alltypes: 'data/ex-alltypes.json',
    ex_test: 'data/ex-test.json',
}

var container, stats;
var controls;
var camera, cameraTarget, scene, renderer;
var particleMaterial;
var particleCloud;

var settings = new Settings();
function Settings() {
    this.particleSize = 20;
    this.particleAlpha = 1.0;
    this.checker = false;
    this.particleSizeListener = null;
    this.dataset = default_dataset;
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
    
    stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'keydown', onKeyDown, false);

    window.onload = function() {
	// GUI creation
	var gui = new dat.GUI();
	settings.particleSizeListener = gui.add(settings,'particleSize',0.00001,60);
	settings.particleSizeListener.onChange(updateParticleSize);

	settings.particleSizeListener = gui.add(settings,'particleAlpha',0.0,1.0).onChange(function(x) { particleMaterial.uniforms.alpha.value = x; })
	
	gui.add(settings,'dataset', Object.keys(datasets) ).onFinishChange(loadParticleCloud);
    }

    loadParticleCloud(settings.dataset);
}

function loadParticleCloud(key) {
    var positions = [];
    var m22s = [];
    
    var request = new XMLHttpRequest();
    request.open('GET', datasets[key], false);
    request.send(null);
    if (request.status === 200) {
	var dataArr = JSON.parse(request.responseText);
	dataArr.forEach(function(row) {
	    positions.push(row[0]);
	    positions.push(row[1]);
	    positions.push(row[2]);
	    m22s.push(row[3]);
	});
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).setUsage(THREE.DynamicDrawUsage) );
    geometry.setAttribute( 'm22', new THREE.Float32BufferAttribute( m22s, 1 ).setUsage(THREE.DynamicDrawUsage) );


    if (particleCloud != null)
	scene.remove( particleCloud );
    
    particleCloud = new THREE.Points( geometry, particleMaterial );
    scene.add( particleCloud );    
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
    stats.update();
    controls.update();
}

function render() {
    camera.lookAt( cameraTarget );
    renderer.render( scene, camera );    
}
