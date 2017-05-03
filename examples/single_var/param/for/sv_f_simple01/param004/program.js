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
      for(i = 0; i <= 1; i++){
         var x = new Float32Array(data.x_sab); x[i] = i+0.3;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2.toFixed(4));
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
outputs[0] = "id3_R_t2: 0.0000";
outputs[1] = "id3_R_t2: 0.0437";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlUsLgkAQgO/9ij0qSLvrE4IOSUiXCuzgcQnsIGR20FP039t8xFbrYEZP1pPON+OOux8jxlmR74sc
//Y5TEFgtZbo4QGRJ+YZxm8WbLycxHY3TQkthkEcspIwa63FPdQJxQ/pSuk51ASCuR1FRL60c0WUzRfPmu
//9cq4uIokTu/6C/2gbFBr4ueM5u28tuykDVIImhC0IGhD0IGgC0Gv+eSgPhJJVpWxiuoM2bEOsPLsZzx7
//mUq3UNhQq4Nn5WZJqkX/lGl/M9HcNl+o1FEBOhD0eptGO5pmW54y7SHThC4INCUoBE14vrxEJrenadfb
//3ts0NdO+b6a5H9DQe+Lv2cnAE9R7fmw=
