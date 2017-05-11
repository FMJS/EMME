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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 1;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 257;id7_R_t3: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt28tqwkAUgOF9nyLLFoSYzGigpYtKkW7agl24DIV0Eai1C12VvnvVRI06iYnMJdV/J2cuSYx+HOZw
//fH86n33PZ77vpUk/HsUzcet179IkWn/2/ck0+fhcTHgaePfez3WahPE4ngWdxQqx+nTT8XaishAVymh2
//pWU0u04WDRYzJu/p1zIeFmYX46IkLkvivWU8PIz3S66b38+v9/Dy6D2/Xs4T7z1RcZdttK+cW9xBKHcQ
//yh2Ecgep3EEqd5DKHbJ1+3O30Z13PBoMVy955x2tv5/Fyu5yddlgUDUYVg2KfDCqWhmpV+Y3Psx/nMr9
//1auzlW/jfGWTP8SVr6IigAqogApdGmwHN6+4ax4KxVUb81HNRNjrAwVQAEWNnKIhFJtXGdiEQhiDIgIK
//oAAKPUmDayZC5Y/QFB6cW0AHdBjIMaQTPKQhJjizgAmY0J5hyBZlGJIMAzqgo62VkUNXNg8U2sSj+DWS
//YcAETNiuijTKMNwgoc4wTNFBpQQ8wKNejlGjGOIaD2EZD6on4AEeWgok7cw77ILCeQecwMlpuYhsGyjS
//Kh2cgUAHdGgppLQzE5FkInACJ5fSk3I4WMDo9I6UvXi+5/E+FbIOmICJtvWj6ECidjfKcTqoscAETLSv
//G0UvE8IYE1RTYAImHPWimMslzNPBaQVwAIezThS9dEhDSHBWARIg4agPxUZ2IckugAM4zq0LRS8dRwqm
//ZBcgARL/rQfFRnZhCg6qI9ABHc46UMzVRmzQQcUEOqDDSf+J7XqJeU445wATMHHUfWKuhsLZB3AAx5n2
//ntiuq+jE5A/XQp4w
