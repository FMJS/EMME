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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 0;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 256";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9rgzAYBvD7PkWOGxRS8xqFjR1WRtllG3SHHmXgDsK67mBPo999Wq1Yfd1sjG0Kz03evPFPlB/y
//ECnXm/R7k0opkjiIFlGqbsX0LonD/bGUq3X88Zk1PM3Evfi5TmIVLaPUm2QzaHd0MxEHVZ+t6lqV2F5i
//e322WtxrXi3utKh6WcfqPfnK66rWXa9TR93vqOuOetBx3fJ+tuLh5VE8v2LN+q9Z4+kDtlrvJbaX2F6f
//7fXZXs326mZv8Y4Xs/nuJR+s8P7pspnTfHbXoFcOhtyg+muQ9pefl58Ye35+djHzbZnP3F5JDgEPCAAB
//IGALAa+FQLXM0/EJYK5qDIPSAWgADaBhvP+Dajm9U9JAFmgIQQNoAA2DaGj9GJwKBsW+8OEsIE8ACkDB
//gTyBWoPVgqsBaUKjXp4TGQNgAAyXkDHYYKF3wmCMBXIHcAEuHMgd7HJBo3GBLAJcgIszZxFmWBglEcZU
//1POJ7C8DVIAKUOHKjodqYcleQqGNEgrQABpAgzP7II6HwTSj0IYZBcAAGADDmd0RQ8Cg0cAIAQbAABju
//7Znow4WNnEIjpwAVoOICcopacmkzpfBZLpBRgAWw4H5GYRWF/xKKoVQgnwAWwOJ8+cRIWNBIWCCbABbA
//4jzZxEAqjkkm+kPxC6eCYkg=
