const maxFlats = 12;
let flatsData = [];

function initializeFlats() {
    for (let i = 1; i <= maxFlats; i++) {
        const exists = flatsData.find(flat => flat.flat === i);
        
        if (!exists) {
            flatsData.push({ flat: i, residents: [] });
        }
    }
}
const buildingDiv = document.getElementById('building');

function renderBuilding() {
    buildingDiv.innerHTML = '';
    const sortedFlats = flatsData.sort((a, b) => a.flat - b.flat);
    sortedFlats.forEach(({ flat, residents }) => {
        const flatDiv = document.createElement('div');
        flatDiv.className = 'flat';

        const title = document.createElement('h3');
        title.textContent = `Квартира №${flat}`;
        flatDiv.appendChild(title);

        const tenantList = document.createElement('ul');
        if (residents.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = '(пусто)';
            emptyItem.className = 'empty';
            tenantList.appendChild(emptyItem);
        } else {
            residents.forEach(name => {
                const item = document.createElement('li');
                item.textContent = name;
                tenantList.appendChild(item);
            });
        }
        flatDiv.appendChild(tenantList);
        buildingDiv.appendChild(flatDiv);
    });
}

function correctFlatNumber(flatNumber) {
    const num = parseInt(flatNumber);
    return num >= 1 && num <= maxFlats;
}

function addTenant(flatNumber, tenantName, obj) {
    const num = parseInt(flatNumber);
    if (correctFlatNumber(num) && tenantName) {
        const targetFlat = obj.find(flat => flat.flat === num);

        if (!targetFlat) return false; 

        targetFlat.residents.push(tenantName);
        return true;
    }
    return false;
}

function removeTenant(flatNumber, tenantName, obj) {
    const num = parseInt(flatNumber);
    if (correctFlatNumber(num) && tenantName) {
        const targetFlat = obj.find(flat => flat.flat === num);
        
        if (!targetFlat) return false;

        const initialLength = targetFlat.residents.length;
        targetFlat.residents = targetFlat.residents.filter(name => name !== tenantName);
        return targetFlat.residents.length < initialLength;
    }
    return false;
}

function replaceAllTenants(flatNumber, newTenantList, obj) {
    const num = parseInt(flatNumber);
    if (correctFlatNumber(num) && Array.isArray(newTenantList)) {
        const targetFlat = obj.find(flat => flat.flat === num);

        if (!targetFlat) return false;
        
        targetFlat.residents = newTenantList;
        return true;
    }
    return false;
}

function replaceTenant(flatNumber, oldTenant, newTenant, obj) {
    const num = parseInt(flatNumber);
    if(correctFlatNumber(num) && oldTenant && newTenant) {
        const targetFlat = obj.find(flat => flat.flat === num);

        if (!targetFlat) return false;

        const index = targetFlat.residents.indexOf(oldTenant);
        if (index !== -1) {
            targetFlat.residents[index] = newTenant;
            return true;
        }
    }
    return false;
}

function initializeAndRender() {
    initializeFlats();
    renderBuilding();
}

function handleActionChange() {
    const selectedAction = document.getElementById('masterActionSelect').value;
    
    document.getElementById('inputs_flat').style.display = 'none';
    document.getElementById('inputs_name').style.display = 'none';
    document.getElementById('inputs_old_name').style.display = 'none';
    document.getElementById('inputs_new_name').style.display = 'none';
    document.getElementById('inputs_list').style.display = 'none';

    if (selectedAction === 'add') {
        document.getElementById('inputs_flat').style.display = 'block';
        document.getElementById('inputs_name').style.display = 'block';
    } else if (selectedAction === 'remove') {
        document.getElementById('inputs_flat').style.display = 'block';
        document.getElementById('inputs_name').style.display = 'block';
    } else if (selectedAction === 'replaceOne') {
        document.getElementById('inputs_flat').style.display = 'block';
        document.getElementById('inputs_old_name').style.display = 'block';
        document.getElementById('inputs_new_name').style.display = 'block';
    } else if (selectedAction === 'replaceAll') {
        document.getElementById('inputs_flat').style.display = 'block';
        document.getElementById('inputs_list').style.display = 'block';
    }
}

function functionMaster(func, flatNum) {
  if (func === addTenant || func === removeTenant) {
    const name = document.getElementById('master_name').value.trim();
    return func(flatNum, name, flatsData);
  } else if (func === replaceTenant) {
    const oldName = document.getElementById('master_old_name').value.trim();
    const newName = document.getElementById('master_new_name').value.trim();
    return func(flatNum, oldName, newName, flatsData);
  } else if (func === replaceAllTenants) {
    const listStr = document.getElementById('master_list').value;
    let newList = [];
    if (listStr.trim().length > 0) {
      newList = listStr.split(',').map(n => n.trim()).filter(n => n.length > 0);
    }
    return func(flatNum, newList, flatsData);
  }
  return false;
}

function handleMasterExecute() {
    const selectedAction = document.getElementById('masterActionSelect').value;
    const flatNum = document.getElementById('master_flatNum').value.trim();
    let success = false;

    if (selectedAction === 'add') {
      success = functionMaster(addTenant, flatNum);
    } else if (selectedAction === 'remove') {
      success = functionMaster(removeTenant, flatNum);
    } else if (selectedAction === 'replaceOne') {
      success = functionMaster(replaceTenant, flatNum);
    } else if (selectedAction === 'replaceAll') {
      success = functionMaster(replaceAllTenants, flatNum);
    } else {
      alert('Будь ласка, оберіть дію.');
      return;
    }

    if (success) {
      renderBuilding();
      document.getElementById('master_flatNum').value = '';
      document.getElementById('master_name').value = '';
      document.getElementById('master_old_name').value = '';
      document.getElementById('master_new_name').value = '';
      document.getElementById('master_list').value = '';
      document.getElementById('masterActionSelect').value = '';
      handleActionChange();
    } else {
      alert('Помилка. Перевірте дані (номер квартири, імена).');
    }
}
