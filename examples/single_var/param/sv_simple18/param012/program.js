// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 3;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoVtdvIhigeLFC8q1EOPQYiHgLUe0pP0v5s0H6TJRNPNpknkvZXZ2SbdlIfh
//JVJud9HXLpJShIHrr/xI3Yj5bRh4+WcpN9vg/SNueFyIO/F9GQbKX/uRNYt30OHT1UwcVW226pSqxPYS
//22uz1fRek2p6p2nVijs2b+FnUlel7nKdGup2Q91pqLsN183uZy/unx/E0wvOrP2ZVX69y1bLvcT2Ettr
//s7022+uwvU61N33Gq8Xy8JCPTjj/dfHOebK7adHKFj1uUf22SPnll9lfjP1+fne683Wd7NxfSA4BBQSA
//ABAwhYBVQ6A45nn/BDBX1YYB0wFgAAw9TgfFcVrnhIE6w4CJATAAhm4w1IaCc7Gg2AdOmBaAAlD4D1kC
//1RaLA1cdkoRKPftOTAuAATBMIV8wwULrdEEbC0wRwAJYDJ45mMWCesICkwWwABYD5xB6VGilEEamCs+9
//BhWgAlSM5U2H4mDJXDrhaM0QoAE0gIbRvP9wOgy6+YSDSQJcgItpvxXRhQvqiQtMF+ACXIzwXYk2WJjI
//KDBZgApQMYWMopRamkwobJYLTBBgASyMP58wisJf6URXKjBBgApQMVQ20RMV1AsVmCpABagYJpfoCMUp
//qUR7Jn4A0n1fKA==
