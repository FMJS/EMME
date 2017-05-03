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
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 515;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 258";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 258";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 258";
outputs[15] = "id6_R_t2: 515;id7_R_t2: 258";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0czKpKC4sUtyoUBddBiFdBKx1ka6k727SXEjSE00nk8vi34UzZ3KZhI/w
//M1LuD9H3IZJShIHnr/1I3Yn5fRgs8mMpd/tg+xk3PC/Fg/i5DgPlb/zImcUz6HR0MxOVqstWdalKbC+x
//vS5bTe81qaZ3mladuGP3EX4ldVXqLtepoe421HVD3Wu4bnY/R/H4+iRe3rBm7des9vQeWy33EttLbK/L
//9rpsr2Z7db03fcfr5er0kisrnD9dPHOezG4adLLBBTeo/hqk/PKr7BNjz8/PTme+b5KZxyvJIUBAAAgA
//AVsIOGcIFMs8758A5qrGMGhHgQbQABr6+z8oltMZkgayQIMGDaABNHSi4ezHYCgYFPvCu7NQzhMUUAAK
//QGGcPIHOBosFVx3ShFo9O+eFGQNgAAyAYZSMwQYLrRMGYyyquQO4ABfgYpTcwS4X1BsXGlyAC3AxbhZh
//hoVREmFMRSWf0B6oABWgYio7HoqFJXsJhTZLKEADaAANU9kHcTkMphmFNs0oAAbAABhT2R3RBQzqDQwN
//MAAGwJjenok2XNjIKbRhTnELKkAFqBgwpygllzZTCpflwjSjAAtgASwMl1FYReG/hKIrFfV8AlgAC2Ax
//XD7RExbUExYaWAALYDFKNtGRikuSifZQ/AKNg2JA
