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
outputs[2] = "id2_R_t1: 512;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 514;id5_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk9rgzAYxu/7FDluIMTYVGFjh5VRdtkG3aFHGbQHYV13sKfR7z6d/9IkUo2JtfDcwpO8rzHx/Uke
//Qun+kP4cUkpJsgniVZyye+I/JJt53g6yNqW7/Wb7lQ14WZBH8ntbjfOyiFm8zlp3HjlRuaAWI2S1yJ6r
//Ya4GshoJajFCVlnW3n0m3149b1UXZyfqvEUvnq/qYctzy/kcydPbM3l9x+roVkd6ezFLo4basWKGZqXE
//DI0aaseKGbg2A9dm4HKGYo9Xi+X/Jp/MsnrnLNLPo9s6WdnZ7KMmUtvJqscvlU9MGKWPLiI/1nnk8Ybq
//yj1AuaPcUe79y50p5V4n9d0Xu345zRAwZ4AAIAAIWPnn1xNgY0IgsgABDggAAoBARwgoP/uxEHB+0cwA
//gHM/yh/lP+q5X+2st8cfcOqX9DInvAAgAAiYlhdgAwCdnQBjLMAfABgAhlH9AbtgiJyBAZ4BwAAwjOYZ
//mGHByDEwhgJ8BCABSLjw/YF6G5g9H4HDRwACgIDruFPQHwCmPgKHjwAwAAzXcs9gCBgiZ2CAjwAwAAwX
//vHvQBQs2fAQOHwFIABIm5CMIDqJNF2Gm/ZTgIaD8Uf7T8RCsFv85B2EoEuAfAAqAgnv/wBEUIkdQgHcA
//KAAKbr2DgUjo4xx0B8IfBGb3bQ==
