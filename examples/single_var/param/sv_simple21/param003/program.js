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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
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
outputs[1] = "id2_R_t1: 0;id5_R_t2: 2";
outputs[2] = "id2_R_t1: 0;id5_R_t2: 512";
outputs[3] = "id2_R_t1: 0;id5_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk9LwzAYxu9+ihwVCmm6rAXFg0OGFxXmYccizEPBOQ/dSfbdTU3/ZEnKujbtWnlu4UneN2nS91f6
//EEp3+/R7n1JKkk0Qr+KU3RL/LtnMs3Yg2pRud5uPTzHgaUHuyc91Mc4TEbN4LVo3HjlSuaLKEboqs2dq
//mKmBrkaKKkfoKhPt7Xvy5ZXrNnV1darOa3Q5v6mHNfPm6zmQh5dH8vyK3bHtjvb0apZKDa1j1QzVTqkZ
//KjW0jlUzcGsGbs3A9QzyjFeL5d8hH62yeGYR6WfRdZ0s76zO0RJp7WTF9EvjFVNG2aNl5Ns6izxcUZQ7
//yh3l7qjcmVHuZVK//2K3bycQAAQAARf84pcLYEMiIAICgAAgYDAEGB/6oQBwetO6l3+A8kf5o/z7/uc3
//O8vj8Tv88Wt6nhMIAAKAgHH5AC4A0NgFABaABWBhCt6AWyxEwAKwACxM3S9oB4VWboETJMwZoAAoAAoX
//uDlQHgNz5yJwQAAQAASmcp/gfAS09REABoABYJjMLYMuYIgABoABYPiPdw+aYMGFl9AWChxQABQAhV68
//BMVHdOkkzKyvEgAAAAAAY/IRnJb/KRcBUAAUAIXxewg9QSECFAAFQGGS/kFHJJzjHjQHwi8xg/dt
