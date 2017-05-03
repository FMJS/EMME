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
         var x = new Float32Array(data.x_sab); x[i] = i+0.9;
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
outputs[1] = "id3_R_t2: 1.2000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlb0KwjAQgHefImMLxeRSTUFwUERcVNChYxDqULDqUCfx3Y2plajpUSv+0k7tfXfNNfm4UrrZpdtd
//SimJI1/OZMo7hDWZuihNNtFypcioT7pk78QRl6FMQTKPXO7B9YgioJ6SRbw2CCsklppsafdAepMBGU/f
//tZ6Om6tY4nDX36w/1A06efyUkb9d1epOiiBgkGPQx2ALg20MCgwG+ScPz0diycoy5uE5w3asDVp79jOe
//vUylW2hsqF/CM71ZlmrTv9q0v5loosgXsDpqwDYGg8qmQRnToMlr0x41zeiCYVMCMMjx+fISmURF0663
//vZpp9Uz7ypkmPqBh8MTfs5SBR5+AfmE=
