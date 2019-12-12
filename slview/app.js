import * as dat from './lib/dat.gui/build/dat.gui.module.js';
import * as THREE from './lib/three.js/build/three.module.js';
import Stats from './lib/three.js/examples/jsm/libs/stats.module.js';
import { TrackballControls } from './lib/three.js/examples/jsm/controls/TrackballControls.js';

const default_dataset = 'PSL(2,Z) [120k]';

const datasets = {
    '(2,3,7) triangle group':
    { url: 'data/tri237.json',
      longdesc: 'The (2,3,7) triangle Fuchsian group, a cocompact group with elliptic elements.  This group minimizes covolume among all Fuchsian groups.  This group is arithmetic.'
    },
    '(3,3,5) triangle group':
    { url: 'data/tri335.json',
      longdesc: 'The (3,3,5) triangle Fuchsian group, a cocompact group with elliptic elements.  This group is arithmetic.'
    },
    '(3,3,9) triangle group':
    { url: 'data/tri339.json',
      longdesc: 'The (3,3,9) triangle Fuchsian group, a cocompact group with elliptic elements.  This group is arithmetic.'
    },
    '(3,3,10) triangle group':
    { url: 'data/tri3310.json',
      longdesc: 'The (3,3,10) triangle Fuchsian group, a cocompact group with elliptic elements.  This group is non-arithmetic.'
    },
    '(3,4,4) triangle group':
    { url: 'data/tri344.json',
      longdesc: 'The (3,4,4) triangle Fuchsian group, a cocompact group with elliptic elements.  This group is arithmetic.'
    },
    '(3,4,5) triangle group':
    { url: 'data/tri345.json',
      longdesc: 'The (3,4,5) triangle Fuchsian group, a cocompact group with elliptic elements.  This group is non-arithmetic.'
    },
    '(3,4,6) triangle group':
    { url: 'data/tri346.json',
      longdesc: 'The (3,4,6) triangle Fuchsian group, a cocompact group with elliptic elements.  This group is arithmetic.'
    },
    '(3,4,7) triangle group':
    { url: 'data/tri347.json',
      longdesc: 'The (3,4,7) triangle Fuchsian group, a cocompact group with elliptic elements.  This group is non-arithmetic.'
    },
    '(4,4,4) triangle group':
    { url: 'data/tri444.json',
      longdesc: 'The (4,4,4) triangle Fuchsian group, a cocompact group with elliptic elements.  This corresponds to the tiling of the hyperbolic plane by equilateral triangles with interior angles pi/4.  This group is arithmetic.'
    },
    'Golden L Veech group':
    { url: 'data/golden.json',
      longdesc: '6k elements of the Veech group of the "Golden L" billiard table.  (See e.g. C. T. McMullen, "Teichmuller dynamics and unique ergodicity via currents and Hodge theory".', 
    },
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
      longdesc: 'The arithmetic Fuchsian group corresponding to a maximal order in the rational quaternion algebra of discriminant 6.  Geometrically, this is a (3,4,4) triangle group.  Approximately 370,000 elements.  (The example titled "(3,4,4) triangle group" has a larger subset of the same group.)',
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
    this.minLogNorm = 0.0;
    this.maxLogNorm = 15.0;
    this.insideOutside = 1.0;
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
	coordscale: { value: settings.particleSize },
	sizescale: { value: window.innerHeight * window.devicePixelRatio * settings.particleSize / 1600.0 },
	alpha: { value: settings.particleAlpha },
    minnormsq: { value: 0.0 },
    maxnormsq: { value: Math.exp(2.0*settings.maxLogNorm) },
    r4transform: { value: new THREE.Matrix4()  }
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

function hideInfoBox() {
    document.getElementById('infobox').style.display = 'none';
}

function showInfoBox() {
    document.getElementById('infobox').style.display = 'block';
}

function infoBoxVisible() {
    return document.getElementById('infobox').style.display != 'none';
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
    settings.particleSizeListener = gui.add(settings,'particleSize',0.00001,60);
    settings.particleSizeListener.onChange(updateParticleSize);
    gui.add(settings,'particleAlpha',0.0,1.0).onChange(function(x) { particleMaterial.uniforms.alpha.value = x; })
    gui.add(settings,'insideOutside',0.0,1.0).onChange(function(x) { particleMaterial.uniforms.r4transform.value = genOutsideInsideMat(x); })
    var f = gui.addFolder('Filter elements');
    f.add(settings,'minLogNorm',0.0,15.0).onChange(function(x) { particleMaterial.uniforms.minnormsq.value = minNSQ(x); })
    f.add(settings,'maxLogNorm',0.0,15.0).onChange(function(x) { particleMaterial.uniforms.maxnormsq.value = Math.exp(2.0*x); })
    gui.add(settings,'dataset', Object.keys(datasets) ).onFinishChange(loadParticleCloud);
}    


function initStatus() {
    window.addEventListener('click',function(event){
	if (event.target != document.getElementById("infobutton")) {
	    hideInfoBox();
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
