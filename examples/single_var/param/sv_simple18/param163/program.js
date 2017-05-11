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
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 512;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[7] = "id6_R_t2: 512;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9rwjAYBvD7PkWOGwixeROFjR0mQ3bZBu7gsQzqoTDnDvU0/O5rbS21vt1qmtbqnpu8edM/qfxo
//Hirlah19rSMpRRiM/JkfqVsxvAuD8e63lMtVsPiIG54m4l58X4eB8ud+5A3iGbT9dTMQe1XNVk2hSmwv
//sb2arabXmlTTK02rXtyxfA8/k7oqdBfrVFHXFXVTUR9VnDe7no14eHkUz69Ys/prVrr7EVst9hLbS2yv
//Zns122vYXlPuTZ/xbDLdPuS9Fd7dXTxzmMyuGvSywTE3qH4bpN3pp9lfjD0+Pzud+TZPZm6uJBAAAkCg
//VQS8AwTyZR62TwBzVmsYjKdAA2gADe29H+TL6XVJA4EG0AAaTk7DwYtBVzAo9oE3Z6G4lVBAASgAhdPk
//CXQwmC+4apAmlOrZMQEDYAAM55AxuGChdsJgjcX+5gJcgAtwcZLcwS0XBC7ABbi41CzCDgurJMLJNiRm
//A1SAClDRly8e8oUldwmFAQ2gATSc93cQx8Ngm1EYy00HwAAYAKM3X0c0AYMABsAAGP/pm4k6XLjIKWw3
//IxpUgApQ0WFOUUguXaYUmuUCLIAFsND/jMIpCn8lFE2pKG83gAWwABbd5RMtYUHAAlgAi4vKJhpScUwy
//UR+KH4rZYgA=
