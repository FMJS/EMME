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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
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
outputs[1] = "id6_R_t3: 2;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 514;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 258;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 65538;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 66048;id7_R_t3: 0";
outputs[9] = "id6_R_t3: 66050;id7_R_t3: 0";
outputs[10] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[11] = "id6_R_t3: 65794;id7_R_t3: 0";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[13] = "id6_R_t3: 2;id7_R_t3: 1";
outputs[14] = "id6_R_t3: 512;id7_R_t3: 1";
outputs[15] = "id6_R_t3: 514;id7_R_t3: 1";
outputs[16] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[17] = "id6_R_t3: 258;id7_R_t3: 1";
outputs[18] = "id6_R_t3: 65536;id7_R_t3: 1";
outputs[19] = "id6_R_t3: 65538;id7_R_t3: 1";
outputs[20] = "id6_R_t3: 66048;id7_R_t3: 1";
outputs[21] = "id6_R_t3: 66050;id7_R_t3: 1";
outputs[22] = "id6_R_t3: 65792;id7_R_t3: 1";
outputs[23] = "id6_R_t3: 65794;id7_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm01PwkAQhu/+ih41ISntdosf8SAxxIua4IEjMcEDiYgHOBn/uy0tsMDyUdrZEnluzezu0HbbJ2+Z
//eX1/PJ18Tye+7w0Hcb/bn6hbr3k3HLTmx74/Gg8+PpMJT23v3vu5HA7Cfq8/CRrJCjU7ump4STRKj8M0
//qmdHWTTLmUazjFk0SGaM3odfaTw0cphxtSUeGdnNuN4Sj7f8bn4+v97Dy6P3/Pofr20WX16RmX0Z1dZo
//bM1g5lXWvMqaV1nzKmve5b2OrVFzrrbO1etzsz3utjuzTV7ZufldS1Y209XbBoNdg+GuQZUPtnatbNlX
//5ifeyR9Oa3776mzlWy9fWeSFuPBtUAiBAlA4PyiUf++Xg4uNb8ojwfKrhUGxGwg6AAkgAZ1QCgmLDQ5c
//IkGJISECCSDh/JBQVgjUDQTzYZPHRKhjMAEmUA5lGLK4JU5BYW5EtUi4BgkgAeVwvHKoBwh25SCFiVhr
//hXYAFGiHAv9SblJkcfGhS1RoQSigHoAC1YkS6qEeJNjVgxgo4mYEKAAF6qFwWaJuUCjXoNA0QQGKMwRF
//uWLFaeoJx/DQrRs6I4AHKqNwCaNufETWR1MSFPRLAApURsHCxmmqDLfwMD9PAsABOFAYUh6NzUEDO8c7
//NNbiec79vo0D/BkAASBQARHyZ1SBg4PdGfshcZA7AyAABBSCkDujWiAoMSBEAAEg0GEp7c2Q0wfykFh1
//ZgAJIIFqEHJmVIuJPQ3XJYBwDRAAAqpB2pfhQjVIQWLdlQEmwAS6QciVUS0otCASUA4ggYqEuCfDhXIQ
//w8SaIwNMgAmUg4gjQ65K4QQTmoYnMEGnpLAfw3XtwsWHyKobA3SADhSGiBtDrqLhBhP0R4AJFIawF8N1
//naNKdPwBNOoQug==
