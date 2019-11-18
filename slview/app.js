import * as dat from './lib/dat.gui/build/dat.gui.module.js';
import * as THREE from './lib/three.js/build/three.module.js';
import Stats from './lib/three.js/examples/jsm/libs/stats.module.js';
import { TrackballControls } from './lib/three.js/examples/jsm/controls/TrackballControls.js';

const default_dataset = 'PSL(2,Z) [120k]';

const datasets = {
    'PSL(2,Z) [120k]':
    { url: 'data/psl2z-medium.json',
      longdesc: 'The projectivized integer unimodular group.  Approximately 120,000 elements.',
    },
    'PSL(2,Z) [750k]':
    { url: 'data/psl2z-big.json',
      longdesc: 'The projectivized integer unimodular group.  Approximately 750,000 elements.',
    },
    'PSL(2,Z) [12k]':
    { url: 'data/psl2z-tiny.json',
      longdesc: 'The projectivized integer unimodular group.  Approximately 12,000 elements.',
    },
    'Arith d=6 k=Q':
    { url: 'data/disc6.json',
      longdesc: 'The arithmetic Fuchsian group corresponding to a maximal order in the rational quaternion algebra of discriminant 6.  Geometrically, this is a (3,4,4) triangle group.  Approximately 370,000 elements.',
    },
    'Arith d=14 k=Q':
    { url: 'data/disc14.json',
      longdesc: 'The arithmetic Fuchsian group corresponding to a maximal order in the rational quaternion algebra of discriminant 14.  Approximately 125,000 elements.',
    },
    'Diag 1PSG':
    { url: 'data/ex-hyp1.json',
      longdesc: 'Elements of the diagonal subgroup of PSL(2,R) (hyperbolic elements fixing 0 and infinity.',
    },
    '2x Hyp 1PSG':
    { url: 'data/ex-hyp2.json',
      longdesc: 'Elements of two different hyperbolic 1-parameter subgroups of PSL(2,R), with fixed point pairs (0,infinity) and (-1,1).',
    },
    'Many Hyp 1PSG':
    { url: 'data/ex-hypmany.json',
      longdesc: 'Elements of several hyperbolic 1-parameter subgroups of PSL(2,R), all of whose axes pass through the imaginary unit.',
    },
    'Parabolics':
    { url: 'data/ex-parabolics2.json',
      longdesc: 'The upper- and lower-triangular parabolic subgroups of PSL(2,R).',
    },
    'Elliptic 1PSG':
    { url: 'data/ex-elliptics1.json',
      longdesc: 'Elliptic 1-parameter sugroup of PSL(2,R).',
    },
    '2x Elliptic 1PSG':
    { url: 'data/ex-elliptics2.json',
      longdesc: 'Two elliptic 1-parameter sugroups of PSL(2,R).',
    },
    'Many Elliptic 1PSG':
    { url: 'data/ex-ellipticsmany.json',
      longdesc: 'Many elliptic 1-parameter sugroups of PSL(2,R).',
    },
    'Halfturns':
    { url: 'data/ex-halfturns.json',
      longdesc: 'Many elliptic elements of order 2.' ,
    },
    'Trichotomy':
    { url: 'data/ex-alltypes.json',
      longdesc: 'Three one-parameter subgroups: Upper-triangular parabolics, elliptics fixing the imaginary unit, and diagonal hyperbolic elements.',
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

    if (showStats) {
	stats = new Stats();
	container.appendChild( stats.dom );
    }
    
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'keydown', onKeyDown, false);

    window.onload = function() {
	initStatus();
	initGUI();
        loadParticleCloud(settings.dataset);
    }
}

function initGUI() {
    var gui = new dat.GUI();
    settings.particleSizeListener = gui.add(settings,'particleSize',0.00001,60);
    settings.particleSizeListener.onChange(updateParticleSize);
    
    settings.particleSizeListener = gui.add(settings,'particleAlpha',0.0,1.0).onChange(function(x) { particleMaterial.uniforms.alpha.value = x; })

    gui.add(settings,'dataset', Object.keys(datasets) ).onFinishChange(loadParticleCloud);
}    


function initStatus() {
    window.addEventListener('click',function(event){
	console.log(event.target);
	if (event.target != document.getElementById("infobutton")) {
	    document.getElementById('modal').style.display = 'none';
	}
    });
}

function loadParticleCloud(key) {
    var positions = [];
    var m22s = [];

    document.getElementById('desc-short').innerHTML = 'Loading...';
    document.getElementById('desc-title').innerHTML = '';
    document.getElementById('desc-long').innerHTML = '';
    
    var request = new XMLHttpRequest();
    request.open('GET', datasets[key]['url'], false);
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

    document.getElementById('desc-short').innerHTML = key;
    document.getElementById('desc-title').innerHTML = key
    document.getElementById('desc-long').innerHTML = datasets[key]['longdesc'];
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

    // TODO: Check for ESC and close modal.
    
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
