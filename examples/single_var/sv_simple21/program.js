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
      var x = new Int16Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 2;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 514;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 0;id5_R_t2: 1";
outputs[4] = "id2_R_t1: 0;id5_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmLFqwzAQhvc+hcYWDLJs2YKWDgkldGkL6ZDRFNzB0CQdnKnk3StHtnWWzg1yCDTkNvHr7vdJJ39Y
//5ny7q793NeesKpNiWdTinsUPVZk140SPOV9vy88vHfA8Z4/s57aLi3RGWqz06C5iA1UC1US4qnFv1LxR
//E1dVQDURrir0eP1RbaK+bl+H1UFdjujm+b6ejzy3rWfPZq9P7OWNdgfbHWf10MWqORoLHexOQQer5mgs
//dJCog0QdpOtgerycLw5NHlTZrVlnxk322KRoJ20fkUx0UnSPX3hHDETh2SbzfdVk7m849ron9LoHH2hb
//O6zGqim6eliJXSd0sGqKxrYOhJwA5KgANPy7Hh9DjvCQ029OfH7g4ASfhqFMSALRpYHooCrUQaEOilB2
//rT1GUebRCuH2Wb6cjn9yTsMYvDwJgtglXA8IQXSBO/UC50/27YlPuL7hpA/EUJIpAtE1HXNCGaEsEGWA
//Vu5U34QJ/6H+/DQdYOwXUwuaNw==
