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
      var x = new Float32Array(data.x_sab); x[0] = 1.1000;
      var x = new Float32Array(data.x_sab); x[1] = 1.1000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 2.2000;
      var x = new Float32Array(data.x_sab); x[2] = 2.2000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 0.0141;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 2.1000;id7_R_t3: 0.0000";
outputs[3] = "id6_R_t3: 3.6000;id7_R_t3: 0.0000";
outputs[4] = "id6_R_t3: 896.1001;id7_R_t3: 0.0000";
outputs[5] = "id6_R_t3: 921.6002;id7_R_t3: 0.0000";
outputs[6] = "id6_R_t3: 896.1002;id7_R_t3: 0.0000";
outputs[7] = "id6_R_t3: 0.0000;id7_R_t3: 1.1000";
outputs[8] = "id6_R_t3: 0.0141;id7_R_t3: 1.1000";
outputs[9] = "id6_R_t3: 2.1000;id7_R_t3: 1.1000";
outputs[10] = "id6_R_t3: 3.6000;id7_R_t3: 1.1000";
outputs[11] = "id6_R_t3: 896.1001;id7_R_t3: 1.1000";
outputs[12] = "id6_R_t3: 921.6002;id7_R_t3: 1.1000";
outputs[13] = "id6_R_t3: 896.1002;id7_R_t3: 1.1000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmz1v2zAQhvf+Co0NEFgmKZL5QIcGRdAlKZAOGY0AzmAgX4MzFf3v1VctOjpScWLKJPVmEu7Ei460
//Hr9H+vL8+XX98rrO82y1VIubxVqcZfPZvPw7Xy31liHPH5+X9w/lrT8vsm/Zn6+rJV/cLtbsuBwr6quj
//46y0FtU1r6yyvmqsTfTK2oRtrKy84/Fu9VTZuRHDtAuLvTCim3ZpsSvL/22f52/2/fpHdvUrxdzePDsn
//M6LzVGQEM64k40oyriTjSjJuN6tm3M5qxtXkvfrtvc0a31xc1ou8Fe3/rJUj59Vom5O5nNzlFC5n4XJK
//l1O5nLp1alee2pWnduWp6Tzbab5sXyXyyejRzcjft+3IXV7fLzlgBpgBZuPAzDOviOkSIaNMDSzZewAH
//kAFkAFlQqqzPqk16hd0l7S4dB8SEP4ixggFigNiUILYZN7erG2Z38WFNtDc+qWjQtcvCQX0BXABXiOpL
//jcg2HV8B6R9sfMYANoANYDtsWbn5CBR2l7S7IkGb+UHfJ8TETAFigBjKSm9l5Sf5pKJBF71wvsAF9QVw
//QX0duKychvYaF2wnp6pCG7b6gTagbbzCcqed/fdwL8LzSv9wO+WsKjg54Aa4oeD0fI6Z+l7Z8MKNptYA
//NAANam2vak2OyLxkzjf9A6/3cw5Wb8Sljrva3mU0FQh2GZnRO6skrco1Z7VVkHEFGVeQcQUZ92MgdsIV
//jU999art6lXb1aumSL5zwxM3v5sG2536ryywBqwBa2iBCgBqQ61PNOqANCANSItKqY3QDBUUzoQfnG03
//QAFnwNlEcZZqW9RBIPaB7VIoMiAMCAtckR22QSrY8tIv4no/ywXigDggLtFWqaAgR594fg5nvfYo4Aw4
//Q9GZVNNUQEWnD4RBkQFhQNg02qciKDp9II5omQLkADlALtFGqmDPOv1ijmieAuaAOZSjSbVUBXoGOoqC
//A9qANqAt+eaqyM5G94W+f2IguIQ=
