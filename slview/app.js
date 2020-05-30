import * as dat from './lib/dat.gui/build/dat.gui.module.js';
import * as THREE from './lib/three.js/build/three.module.js';
import Stats from './lib/three.js/examples/jsm/libs/stats.module.js';
import { TrackballControls } from './lib/three.js/examples/jsm/controls/TrackballControls.js';

const default_dataset = 'Monic cubics (maxcoef=30)';

const datasets = {
    'Monic cubics (maxcoef=20)':
    { url: 'data/cubics20.json',
      longdesc: 'Monic integral cubic polynomials of negative discriminant having all coefs <= 20 in absolute value.'
    },
    'Monic cubics (maxcoef=30)':
    { url: 'data/cubics30.json',
      longdesc: 'Monic integral cubic polynomials of negative discriminant having all coefs <= 30 in absolute value.'
    },
    'Depressed cubics (maxcoef=100)':
    { url: 'data/depcubics100.json',
      longdesc: 'Depressed integral cubic polynomials of negative discriminant having all coefs <= 100 in absolute value.'
    },
    'Depressed cubics (maxcoef=200)':
    { url: 'data/depcubics200.json',
      longdesc: 'Depressed integral cubic polynomials of negative discriminant having all coefs <= 100 in absolute value.'
    },
}

var showStats = false;
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
        minnormsq: { value: 0.0 },
        maxnormsq: { value: Math.exp(2.0*settings.maxLogNorm) },
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
        beginLoadParticleCloud(settings.dataset);
    }
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

function minNSQ(x) {
    if (x == 0.0) {
        return 0.0
    } else {
        return Math.exp(2.0*x);
    }
}

function initGUI() {
    var gui = new dat.GUI();
    gui.add(settings,'dataset', Object.keys(datasets) ).onFinishChange(beginLoadParticleCloud);
    settings.particleSizeListener = gui.add(settings,'particleSize',0.00001,10);
    settings.particleSizeListener.onChange(updateParticleSize);
    gui.add(settings,'particleAlpha',0.0,1.0).onChange(function(x) { particleMaterial.uniforms.alpha.value = x; })
    gui.add(settings,'insideOutside',0.0,1.0).onChange(function(x) { particleMaterial.uniforms.r4transform.value = genOutsideInsideMat(x); })
    var f = gui.addFolder('Filter elements');
    f.add(settings,'minLogNorm',0.0,15.0).onChange(function(x) { particleMaterial.uniforms.minnormsq.value = minNSQ(x); })
    f.add(settings,'maxLogNorm',0.0,15.0).onChange(function(x) { particleMaterial.uniforms.maxnormsq.value = Math.exp(2.0*x); })
}    


function initStatus() {
    window.addEventListener('click',function(event){
	if (event.target != document.getElementById("infobutton")) {
	    hideInfoBox();
	}
    });
}

function beginLoadParticleCloud(key) {
    var request = new XMLHttpRequest();
    request.open('GET', datasets[key]['url'], true);
    request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status === 200) {
                finishLoadParticleCloud(key,request.responseText);
            } else {
                showTransientErrorBox();
            }
        }
    }
    showLoadingBox();
    request.send(null);
}

function finishLoadParticleCloud(key,text) {
    var positions = [];
    var m22s = [];

	var dataArr = JSON.parse(text);
	dataArr.forEach(function(row) {
	    positions.push(row[0]);
	    positions.push(row[1]);
	    positions.push(row[2]);
	    m22s.push(row[3]);
	});

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).setUsage(THREE.DynamicDrawUsage) );
    geometry.setAttribute( 'm22', new THREE.Float32BufferAttribute( m22s, 1 ).setUsage(THREE.DynamicDrawUsage) );

    if (particleCloud != null)
    	scene.remove( particleCloud );
    
    particleCloud = new THREE.Points( geometry, particleMaterial );
    scene.add( particleCloud );

    document.getElementById('desc-short').innerHTML = key;
    document.getElementById('desc-title').innerHTML = key
    document.getElementById('desc-long').innerHTML = datasets[key]['longdesc'];

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
