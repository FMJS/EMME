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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[1] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[3] = "id6_R_t2: 512;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZpMmcOA0biwMY0bNamLLokJLkisdUFXpu8ulEsoHJTC0EL9d82ZM1yG5gvz
//BynXm/BrE0opAt/xFl6obsT0NvDd7LeUq7X//hE1PM7Enfi+DHzlLb3QmkQzaPfraiL2qjZb1YUqsb3E
//9tpsNbnWuJpcaVK1oo7VW/AZ11Whu1inmrpdU9c1dafmvOn1bMX984N4esGaNV+z0t07bLXYS2wvsb02
//22uzvZrt1eXe5BkvZvPdQ95b4ezuopnTeHbdoJUOutyg+m2QstPP078Ye3x+djLzdRnP3F5IIAAEgECv
//CFgVBPJlnvZPAHPW1jBoS4EG0AAa+ns/yJfTOiYNBBpAA2g4OQ2VF4NjwaDYB96dBWwlgAJQGECeQJXB
//fMFVhzShVE+PCRgAA2AYQ8ZggoXGCUNrLLC5ABfgYgC5g1kuCFyAC3BxrllEOyxaJRFGtiGucw0qQAWo
//GMoXD/nCkrmEQoMG0AAaxv0dxOEwtM0odMtNB8AAGABjMF9HdAGDAAbAABj/6ZuJJlyYyCmwGQEVoGIM
//OUUhuTSZUtgsF2ABLICF4WcURlH4K6HoSgW2G8ACWJwun+gJCwIWwAJYnFU20ZGKQ5KJ5lD8AGiDYlg=
