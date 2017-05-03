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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 <= 0) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
      }
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
outputs[0] = "id6_R_t2: 2;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 2;id8_R_t2: 2";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtljtvgzAUhff+Co+JFMngB65aZUjUog59SKRRRlSVDkhN6ECmqv+9PFMHXRdIHMFwN+twLlyu/emY
//0mSffu1TSkkceWEQpuyGsNs4uq7WDqXbJPr4zAwPSzIn35M4YuEmTN1ZVsGL1XRGjlQBqlJTOejloFeA
//atlrrpadlqqbObZv8S7XmebWdW7QhUGXBt0zfLfq54csnu/I0wvOrPvMGn/vgaru5aCXg14BegXolaBX
//Nr3lHgdLv9jkowkfJunktZO6JH9U/3j2wK1f4VfHBHgBXFvWrTZ5XbkuRvqe7KK5v3hc3U+vaBvbDNlG
//tpFtm2wfhtmb7KrSBteY2cg1cm2Va3ky1/I8rp2MazVyroc6jX+jV4YzqkbL9VAzYy30ea30wZx13otG
//FwrsQoFdKLAL1cq1duGuyVbwQyPbmguu/o/v12CNeCPeiPdl8BbN2O4Ltz7wy6DNEG1EG9G2m9zadb13
//brP2WzmijWgj2kOkdhew4cy2hzVexhFrxNpyYoszElsg2og2oj3OxBYnJ3ZXrH8B+XEumw==
