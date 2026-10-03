// external-stats.js

// ফেইক ইউজার / Online Stats
// ====================
const siteStart = new Date("2025-01-01"),
      max3M = 3000,
      mCap = 1000,
      wkMax = [100,150,200,250,300,350,400];

let fOnline = 10;

// DOM element ধরে নেওয়া, যদি না থাকে তাহলে null
const liveStatsEl = document.querySelector('#liveStats'); // বা তোমার এলিমেন্টের আইডি/ক্লাস ব্যবহার করো

(function updateStats(){
    const now = new Date(),
          dMax = Math.min(Math.max(((now.getFullYear()-siteStart.getFullYear())*12 + now.getMonth()-siteStart.getMonth()+1)*mCap,100),max3M),
          tFactor = now.getHours()>=16 ? 1 : now.getHours()>=11 ? 0.8 : now.getHours()>=6 ? 0.6 : 0.4,
          daily = wkMax[(now.getDate()-1)%7],
          aMax = Math.min(Math.floor(dMax*tFactor), daily),
          change = Math.floor(Math.random() * 3) + 1;

    fOnline += Math.random()<0.55 ? change : -change*2;
    fOnline = Math.max(10, Math.min(fOnline, aMax));

    if(liveStatsEl) liveStatsEl.innerHTML = `Online <span class="online-dot"></span> ${fOnline}`;

    setTimeout(updateStats, Math.random()<0.1 ? Math.random()*30000+30000 : Math.random()*1000+1000);
})();