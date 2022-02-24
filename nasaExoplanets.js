// Dani Vicario - nasaExoplanets experiment (threejs) - Wed 23 Feb 2022 18:58:41 CET
let camera;
let scene;
let renderer;
let geometry;
let material;
let mesh, mesh2;
let planetMesh = [];
let planetData;
let totalPlanets = 8;
function init() {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000000);
  camera.position.z = 1;

  scene = new THREE.Scene();

  const quality = 70;

  let planetScale = d3
    .scaleLinear()
    .domain([planetData[planetData.length - 1].radius, planetData[0].radius])
    .range([0.2, 2]);

  for (let i = 0; i < totalPlanets; i++) {
    console.log(planetData[i].radius);
    texture = new THREE.TextureLoader().load(`planetTextures/texture${i + 1}.jpg`);
    geometry = new THREE.SphereGeometry(planetScale(planetData[i].radius), quality, quality);
    material = new THREE.MeshBasicMaterial({ map: texture });
    planetMesh[i] = new THREE.Mesh(geometry, material);

    planetMesh[i].position.x = i * 4;

    scene.add(planetMesh[i]);
  }

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  // controls.screenSpacePanning = false;
  // controls.minDistance = 100;
  // controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2;
}

function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i < planetMesh.length; i++) {
    planetMesh[i].rotation.y += 0.01 / 5;
  }

  camera.position.x += 0.01 / 2;

  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.02 / 6;
  // mesh2.rotation.x -= 0.02 / 6;
  // mesh2.rotation.y += 0.02 / 6;

  renderer.render(scene, camera);
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function addStarField() {
  var geometry = new THREE.SphereGeometry(4000, 100, 100);
  var veryBigSphereForStars = new THREE.Mesh(geometry, undefined);

  veryBigSphereForStars.geometry.vertices
    .filter((x) => Math.random() > 0.5)
    .forEach((starCoords) => {
      const geometry = new THREE.SphereGeometry(5, 3, 3);
      const material = new THREE.MeshBasicMaterial({
        color: `rgb(255, 255, 255)`,
        transparent: true,
        opacity: Math.random()
      });
      const star = new THREE.Mesh(geometry, material);

      star.position.x = starCoords.x + randomFloat(-100, 100);
      star.position.y = starCoords.y + randomFloat(-100, 100);
      star.position.z = starCoords.z + randomFloat(-100, 100);

      scene.add(star);
    });

  scene.add(veryBigSphereForStars);
}

/**
 * Retrieve a fixed number of elements from an array, evenly distributed but
 * always including the first and last elements.
 *
 * @param   {Array} items - The array to operate on.
 * @param   {number} n - The number of elements to extract.
 * @returns {Array}
 */
function distributedCopy(items, n) {
  var elements = [items[0]];
  var totalItems = items.length - 2;
  var interval = Math.floor(totalItems / (n - 2));
  for (var i = 1; i < n - 1; i++) {
    elements.push(items[i * interval]);
  }
  elements.push(items[items.length - 1]);
  return elements;
}

(async function () {
  let planetsVisited = 0;
  const planetsData = await fetch("http://127.0.0.1:8080/exoplanetsFiltered.json");
  planetData = await planetsData.json();
  window.onkeydown = (key) => {
    if (key.key === "d") {
      document.querySelector("#planet").innerHTML = planetData[planetsVisited].name;
      planetsVisited++;
    }
  };

  // debugger;
  // planetData = distributedCopy(planetData, totalPlanets);
  planetData = [...planetData.splice(0, totalPlanets)];

  init();
  addStarField();
  animate();
})();
