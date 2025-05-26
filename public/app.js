
fetch('/productos.json')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#productos tbody');
    data.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${p.code}</td><td>${p.description}</td><td>$${p.price}</td>
                       <td><input type='number' min='0' data-code='${p.code}' /></td>`;
      tbody.appendChild(row);
    });
  });

document.getElementById('pedido-form').addEventListener('submit', async e => {
  e.preventDefault();
  const cliente = document.getElementById('cliente').value;
  const inputs = document.querySelectorAll('input[type="number"]');
  const pedido = [];
  inputs.forEach(input => {
    const cantidad = parseInt(input.value);
    if (cantidad > 0) {
      pedido.push({ codigo: input.dataset.code, cantidad });
    }
  });
  const res = await fetch('/api/pedido', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente, pedido })
  });
  const result = await res.text();
  document.getElementById('mensaje').innerText = result;
});
