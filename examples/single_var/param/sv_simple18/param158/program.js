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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 259;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 259;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 259;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 258";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 258";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 258";
outputs[15] = "id6_R_t2: 259;id7_R_t2: 258";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZpMmcNQ0biwMY0bNakLl8QEFyTWuqAr03cXCiVAD0qH4bL4d+TMGS4D+UL+
//jJTbXfy9i6UUUegF6yBWN2J+G4WL47GUm2348Zk0PC7Fnfi5jEIVvAWxM0tm0OHoaiYqVZet6lKV2F5i
//e122mt1rWs3uNKs6ScfmPfpK66rUXa5TQ91tqOuGutdw3fx+9uL++UE8vWDN2q9Z7ek9tlruJbaX2F6X
//7XXZXs326npv9o7Xy9XhJVdW+Ph0ycx5Ortp0MkHF9yg+muQjpdf5Z8Ye35+djbz9S2dub+QHAIEBIAA
//ELCFgHOCQLHM8/4JYK5qDIPSHmgADaChv/+DYjmdIWkgCzT4oAE0gIZONJz8GAwFg2JfeHcWynmCAgpA
//ASiMkyfQyWCx4KpDmlCr5+c8M2MADIABMIySMdhgoXXCYIxFNXcAF+ACXIySO9jlgnrjwgcX4AJcjJtF
//mGFhlEQYU1HJJ7QHKkAFqJjKjodiYcleQqHNEgrQABpAw1T2QZwPg2lGoU0zCoABMADGVHZHdAGDegPD
//BxgAA2BMb89EGy5s5BTaMKe4BhWgAlQMmFOUkkubKYXLcmGaUYAFsAAWhssorKLwX0LRlYp6PgEsgAWw
//GC6f6AkL6gkLH1gAC2AxSjbRkYpzkon2UPwCaGZiaA==
