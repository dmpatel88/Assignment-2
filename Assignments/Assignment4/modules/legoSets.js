/********************************************************************************
* WEB700 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Dev Mihir Patel Student ID: 143122240 Date: 02/11/2025
*
* Published URL: 
*
********************************************************************************/

// modules/legoSets.js
class LegoData {
  constructor() {
    this.sets = [];
  }

  initialize() {
    return new Promise((resolve, reject) => {
      try {
        const setData = require("../data/setData");
        const themeData = require("../data/themeData");

        this.sets = [];

        setData.forEach(s => {
          const themeObj = themeData.find(t => t.id.toString() === s.theme_id.toString());
          const themeName = themeObj ? themeObj.name : null;
          const newSet = Object.assign({}, s);
          newSet.theme = themeName;
          this.sets.push(newSet);
        });

        resolve();
      } catch (err) {
        reject("Unable to initialize data: " + err);
      }
    });
  }

  getAllSets() {
    return new Promise((resolve, reject) => {
      if (this.sets && this.sets.length > 0) resolve(this.sets);
      else reject("No sets available");
    });
  }

  getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const found = this.sets.find(s => s.set_num === setNum);
      if (found) resolve(found);
      else reject(`Unable to find set: ${setNum}`);
    });
  }

  getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      if (!theme) {
        reject("Theme parameter is required");
        return;
      }
      const search = theme.toLowerCase();
      const filtered = this.sets.filter(s => s.theme && s.theme.toLowerCase().includes(search));
      if (filtered && filtered.length > 0) resolve(filtered);
      else reject(`Unable to find sets for theme: ${theme}`);
    });
  }

  // 🆕 Step 3: Add this new method
  addSet(newSet) {
    return new Promise((resolve, reject) => {
      // Check if the set already exists by comparing set_num
      const exists = this.sets.some(s => s.set_num === newSet.set_num);
      
      if (exists) {
        reject("Set already exists");
      } else {
        this.sets.push(newSet);
        resolve();
      }
    });
  }
}

module.exports = LegoData;
