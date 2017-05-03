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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 769;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 769;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwhs1nFN09JDQwm9tIX0kKME7EFomh7MqeS/V6MRo2Nr1vXj8N7C7GzUNTyE
//l5Fyt4++95GUIgw8f+VHzp2Y3ofB7PRZyu0u+PiMG54X4kH8XIeB46/9SE3iHXT8dDMRZ1WXrepCldhe
//Yntdtprea1JN7zStqrhjuwm/krpT6C7Wqabu1tR1Td2ruW52Pwfx+PokXt5wZs3PrPT0Hlst9hLbS2yv
//y/a6bK9me3W5N33Hq8Xy+JLPTvj0dPHOabK7blFlizNu0flrkU6XX2Y/Mfb7+d3pzvd1svNwJTkEFBAA
//AkDAFgKqgkB+zNPuCWCuagzDzLsFDaABNHT3/yA/TtUnDWSBhjloAA2goRUNlT8GfcHgsC+8PQvFPEEB
//BaAAFIbJE6iymB+40yJNKNWz77wwYwAMgAEwDJIx2GChccJgjMV57gAuwAW4GCR3sMsFdcbFHFyAC3Ax
//bBZhhoVREmFMBeYdAAWgGOW8Q36wZC+f0Eb5BGAADIBhJDMQl7Ngmk9ow3wCXIALcDGSuYg2XFBnXGBW
//AlyAi9HNSjTBwkY+oY3yCQSZgAJQ9JlPFPJKm+mEy2KhMTsBFIDCyLMJqyT8l0y0hQJzE6ACVAyVS3RE
//BXVEBWYmQAWoGCKTaAnFJYlEcyZ+AcMsXyg=
