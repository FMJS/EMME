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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 0;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 3;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwhs3HENtPTQUEIvbSE95CgFcxCapgdzKvnv1fiB0bHVdY0W3lsYZ6NZw8Pw
//qpT7Q/R1iKQUYeD5az9St2J+FwaL/LOUu32w/YgbnpbiXnxfh4HyN37kzOIVdPp0MxNnVZet6lKV2F5i
//e122ml5rUk2vNK06ccfuPfxM6qrUXa5TQ91tqOuGutdw3ux6juLh5VE8v2LP2u9Z5dd7bLXcS2wvsb0u
//2+uyvZrt1dXe9B6vl6vTTT7b4fzXxSvnyeqmg052cMEdVL8dpPz0q+wvxn4/vzpd+bZJVh6vJIcAAQEg
//AARsIeDUECi2eT48AcxZjWHAdAAYAMOA00Gxnc4lYaDeMGBiAAyAoR8MtaHgUiwo9oaT1WlBAQWgABTG
//yRKodrDYcNUjSajUs+/sOC0ABsAAGEbJF2yw0DpdMMYCUwSwABajZw52saCBsMBkASyAxcg5hBkVRimE
//lakCgSWgABSTec+h2Fiyl01oowkCMAAGwDCRdx+6s2CaTWhMEcACWPzn9yH6YEEDYYHJAlgAi8m9I9GG
//ChvZhMYTD0ABKCafTZSySpvJhMtiofFkAygAhYnnElZJ+CuV6AsFpgdAASjGySQGgoIGgQITBaAAFGPk
//ET2Z6JJGtEfiB51BW5g=
