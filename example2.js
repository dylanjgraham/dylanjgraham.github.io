//Author: Dylan Graham


var container, stats;
var increment = 0, clock = new THREE.Clock(),
controls, container, gui = new dat.GUI( { width: 350 } ),
options, spawnerOptions, particleSystem;

			var camera, scene, renderer;
			var mouseX = 0, mouseY = 0;
			var flagMoveY = false;														//used for switching between x and y movement
			var mouseMoved = false;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			init();
			animate();

			function init() {
				particleSystem = new THREE.GPUParticleSystem({});
				scene = new THREE.Scene();
				scene.add( particleSystem );

//particle system options
				options = {
				position: new THREE.Vector3(),
				positionRandomness: 5000,											//I wanted them all over the screen so I increased the number
				velocity: new THREE.Vector3(),
				velocityRandomness: .5,
				color: 0xaa88ff,
				colorRandomness: 100,
				turbulence: .5,
				lifetime: 2,
				size: 5,
				sizeRandomness: 1
			};

//spawn rate changes how quickly the particles are placed one after the other
			spawnerOptions = {
				spawnRate: 10,
				horizontalSpeed: 1.5,
				verticalSpeed: 1.33,
				timeScale: 1
			};

				container = document.createElement( 'div' );
				document.body.appendChild( container );
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.set( 0, 0, 1000 );


				renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.autoClearColor = false;
				container.appendChild( renderer.domElement );
				stats = new Stats();
				container.appendChild( stats.dom );

				//Detects mouse movement
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				window.addEventListener( 'resize', onWindowResize, false );
			}

			function onWindowResize() {
				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			function onDocumentMouseMove( event ) {
				//flag used to change move modes from x to y
				mouseMoved = true;

				mouseX = ( event.clientX);
				mouseY = ( event.clientY);
			}

			function animate() {
				requestAnimationFrame( animate );


				var timeDiff = .016;
				increment += timeDiff;

				options.position.x = Math.sin(increment * spawnerOptions.horizontalSpeed) * 20;
				options.position.y = Math.sin(increment * spawnerOptions.verticalSpeed) * 10;
				options.position.z = Math.sin(increment * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;
				// procedurally create the particle system
				for (var x = 0; x < spawnerOptions.spawnRate * timeDiff; x++) {
					particleSystem.spawnParticle(options);
				}
				
				particleSystem.update(increment);
				stats.update();
				render();
			}

			function render() {
					//always moving in the x direction
				  camera.position.x +=10;

					// When x pos gets to 1000 move in y direction and decrease x
				if (camera.position.x >1000 || flagMoveY == true) {
					flagMoveY = true;
					camera.position.y += 10;
					camera.position.x -=10;

					// when x pos is back down low reset flag and move in other y direction
					if (camera.position.x <30) {
						flagMoveY = false;
						camera.position.y -= 10;
					}
				}

				// if mouse movement detected ignore previously assigned x and y cords and move based on input
				if (mouseMoved) {
					camera.position.x +=( mouseX - camera.position.x) * 1.0;
					camera.position.y += ( mouseY - camera.position.y) * 1.0;
					mouseMoved = false;
				}


				camera.lookAt(scene.position);
				renderer.render(scene, camera);
			}
