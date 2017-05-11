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
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 3";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoVtdrIJKB4sUryoUA89BiEeAtZ6SE/S/27SfJCmE003u00O763MzjbJpjyU
//l5Fyu0u/d6mUIomDaBWl6lbM75I4rD5LudnGH59Zw9NC3Iuf6yRW0TpKvVm2gw6fbmbiqOqzVd2oEttL
//bK/PVot7zavFnRZVL+vYvCdfeV01upt16qj7HXXdUQ86rlvez148vDyK51ecWf8zaz19wFabvcT2Etvr
//s70+26vZXt3uLd7xarE8vOSjE66eLts5z3d3LXrlYsgtqr8Wqbr8svyJsd/P7y52vq3znfsrySHgAQEg
//AARsIeCdIFAf89w9AcxVjWFQOgANoAE0uPt/UB+nd0kayAINIWgADaBhEA0nfwwuBYNiX/hwFpp5AgEF
//oAAUxskT6GSxPnA1IE1o1cvvPDNjAAyAATCMkjHYYKF3wmCMxXHuAC7ABbgYJXewywU54yIEF+ACXIyb
//RZhhYZREGFOBeQdAASgmOe9QHyzZyye0UT4BGAADYJjIDMT5LJjmE9ownwAX4AJcTGQuYggX5IwLzEqA
//C3AxuVmJPljYyCe0UT6BIBNQAIpL5hONvNJmOuGzWGjMTgAFoDDxbMIqCf8lE0OhwNwEqAAVY+USjqgg
//R1RgZgJUgIoxMomBUJyTSPRn4heuyl74
