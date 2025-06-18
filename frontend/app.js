const token = localStorage.getItem('token');
if (!token) location='login.html';
const headers = { 'Content-Type':'application/json', 'Authorization':'Bearer '+token };

const map = L.map('map').setView([21.132946, -101.678042], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const drawGroup = new L.FeatureGroup().addTo(map);
new L.Control.Draw({ draw: { polyline:false, marker:true }, edit:{ featureGroup: drawGroup } }).addTo(map);

map.on(L.Draw.Event.CREATED, async e => {
  const layer = e.layer;
  let data;
  if (layer instanceof L.Marker) {
    const { lat, lng } = layer.getLatLng();
    const name = prompt('Nombre:'); const desc = prompt('Descripción:');
    data = await fetch('http://localhost:5001/api/locations',{ method:'POST', headers, body:JSON.stringify({ name, description:desc, latitude:lat, longitude:lng })}).then(r=>r.json());
    layer.bindPopup(`${name}<br>${desc}<br><button class="buttons" onclick="edit('${data._id}')">Editar</button> <button onclick="del('${data._id}')">Borrar</button>`);
  } else {
    const coords = layer.getLatLngs()[0].map(p=>[p.lng,p.lat]);
    data = await fetch('http://localhost:5001/api/shapes',{ method:'POST', headers, body:JSON.stringify({ name:prompt('Nombre figura'), coordinates:coords })}).then(r=>r.json());
    layer.bindPopup(data.name + ' <button class="buttons" onclick="delShape(\''+data._id+'\')">Borrar</button>');
  }
  drawGroup.addLayer(layer);
  loadTable();
});

async function loadTable(q='') {
  const locs = await fetch('http://localhost:5001/api/locations'+(q?`/search?q=${q}`:''),{headers}).then(r=>r.json());
  const tbody = document.querySelector('#table tbody');
  tbody.innerHTML = '';
  locs.forEach(l=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${l.name}</td><td>${l.description}</td><td>${l.longitude.toFixed(4)}</td><td>${l.latitude.toFixed(4)}</td>
      <td>
        <button class="buttons" onclick="zoom('${l._id}')">Ver</button>
        <button class="buttons" onclick="edit('${l._id}')">Editar</button>
        <button class="buttons" onclick="del('${l._id}')">Borrar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

document.getElementById('search').oninput = e => loadTable(e.target.value);
loadTable();
loadShapes();
loadMarkers();

async function zoom(id) {
  const res = await fetch(`http://localhost:5001/api/locations`, { headers });
  const locs = await res.json();
  const loc = locs.find(l => l._id === id);
  if (loc) {
    map.setView([loc.latitude, loc.longitude], 17);
  }
}

async function del(id) {
  if (!confirm("¿Seguro que deseas borrar este lugar?")) return;
  await fetch(`http://localhost:5001/api/locations/${id}`, {
    method: "DELETE",
    headers
  });
  alert("Lugar eliminado");
  location.reload(); // recarga para actualizar vista
}

async function edit(id) {
  const res = await fetch(`http://localhost:5001/api/locations`, { headers });
  const locs = await res.json();
  const loc = locs.find(l => l._id === id);
  if (!loc) return alert("Lugar no encontrado");

  const newName = prompt("Nuevo nombre:", loc.name);
  const newDesc = prompt("Nueva descripción:", loc.description);

  if (newName && newDesc) {
    await fetch(`http://localhost:5001/api/locations/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ name: newName, description: newDesc })
    });
    alert("Lugar actualizado");
    location.reload();
  }
}
async function delShape(id) {
  if (!confirm("¿Seguro que deseas borrar esta figura?")) return;
  await fetch(`http://localhost:5001/api/shapes/${id}`, {
    method: "DELETE",
    headers
  });
  alert("Figura eliminada");
  location.reload(); // recarga para actualizar vista
}

async function loadShapes() {
  const shapes = await fetch('http://localhost:5001/api/shapes', { headers }).then(r => r.json());
  shapes.forEach(s => {
    // Convertimos los pares [lng, lat] a objetos tipo LatLng [lat, lng]
    const latlngs = s.coordinates.map(coord => [coord[1], coord[0]]);
    const polygon = L.polygon(latlngs);
    polygon.bindPopup(`${s.name} <button class="buttons" onclick="delShape('${s._id}')">Borrar</button>`);
    drawGroup.addLayer(polygon);
  });
}

async function loadMarkers() {
  const locations = await fetch('http://localhost:5001/api/locations', { headers }).then(r => r.json());
  locations.forEach(loc => {
    const marker = L.marker([loc.latitude, loc.longitude]);
    marker.bindPopup(`${loc.name}<br>${loc.description}<br>
      <button class="buttons" onclick="edit('${loc._id}')">Editar</button>
      <button class="buttons" onclick="del('${loc._id}')">Borrar</button>`);
    drawGroup.addLayer(marker);
  });
}


function logout() {
  localStorage.removeItem('token');
  location = 'login.html';
}
document.getElementById('logout').onclick = logout;