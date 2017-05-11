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
      if(id6_R_t2 >= 0) {
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
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtl0FLw0AQhe/+ij22UNh2d2pA6cFSixcVotJjKK6HQNt4SE/ifzfJJrLRCcTsBjy82/Ays0x28jEv
//Umbn/P2cSylSc5nESa6uxPw6NVETS3nMzNuhSLhbi5X4mKRGJbskX8yKCl1F05loqcSqS0fVbK5mc4lV
//F0V83KenUlcduu7QqUPvOt/ei9VtXKqRo7rZtf4pbh424v4Rd+a8j6tqViVWXbJq71n86CJiu4jYLiK2
//i9aM4/W2GnKro6aLonJeVk+aol8P60O29YfCHsFX28qnXVlp4+r1X7OTWT3HL7fTC8nhrYA38AbeXnh/
//3+9QuN0BhUMbmxtoA20/tMkXbRodbQW0gTbQDmvKnZX+Z0te1wYw5EAbaAPtoIa8D9i8HffDGhsbWAPr
//0cx4H6xpZKzxjw2sgXVgI04eRpyCGXGgDbSBdlAjToONOGFjA2tg/T+NOA024n2x/gIHGi3y
