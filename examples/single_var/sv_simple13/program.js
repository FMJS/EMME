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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[1]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[4] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 513;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 131073;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 131328;id7_R_t3: 0";
outputs[9] = "id6_R_t3: 131329;id7_R_t3: 0";
outputs[10] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[11] = "id6_R_t3: 131585;id7_R_t3: 0";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[13] = "id6_R_t3: 1;id7_R_t3: 2";
outputs[14] = "id6_R_t3: 256;id7_R_t3: 2";
outputs[15] = "id6_R_t3: 257;id7_R_t3: 2";
outputs[16] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[17] = "id6_R_t3: 513;id7_R_t3: 2";
outputs[18] = "id6_R_t3: 131072;id7_R_t3: 2";
outputs[19] = "id6_R_t3: 131073;id7_R_t3: 2";
outputs[20] = "id6_R_t3: 131328;id7_R_t3: 2";
outputs[21] = "id6_R_t3: 131329;id7_R_t3: 2";
outputs[22] = "id6_R_t3: 131584;id7_R_t3: 2";
outputs[23] = "id6_R_t3: 131585;id7_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmz1PwzAURXd+RUaQkNLYdUJBDCCEWAAJBsYKqQyV+BrKhPjvJE1oHeoWkvg5iJ4teo5fmzj39KrO
//jeOXt9nr2yyOo+kkHd+MZ/owGhxNJ9nXcRw/vUweHvMTLk6j4+h9dzpR47vxLNnPZ+j50d5+lFeHxbEq
//qmZ+VFbLnkW17FhWk/yMp/vpc1FXVg+7rtfUh1Z3u27W1NM1n1t9n4/o5Oosurz+j9c2ry+vyO6+rBpn
//NXV2sPtqZ1/t7KudfbWz7/Jep86qfa5xnmu+n1uu8c3p+XyRayv3ddfymYNi9rrBZNOg2jSoq8Fs08zM
//PbP64ufVw+ns755dzry9K2Z+7MQumSfIHJlvn8y7K3k5uFj4gbzIHZ/aWvrKpIgf8fMb30X8iwVOQopf
//exB/hvgR//aJv+uPe9/Stx82n0AwiQIIAAE30IUWi1sSFAn2QrQVv0b8iB830N4N9CN9txvoDoREJ4MM
//QwATMAQN/jhcBcbi4lVIKhg/+scToH/2Bjp4gn7U7/YEXpig1QFMgAl4gqa7An0zQUsyYQQTYML2MaHb
//ZsHfdAmCnDAHQzgBJ/AOTfcQ+ibF0PloemKCgQkwAe/QbGvhb3oHKU7YSQQFIkAEtkEqibA6aAGmfQ7h
//W73q2TCdgPSRPjsQQukEH8L/dTahNQ7qiQWAABDwAkKJBb9A0GJAyAACQOC9RekUg5w/kIdEPdkAJIAE
//rkEo2eAXEz+8xtwBCBogAARcg3TaIYRrkILESgICTsAJjINQAsIvKYwkE/AOMIE9CfFURAjvIMiJelIC
//TsAJvINIUkJuoyIQJ0ZwAk7wBqRseiL0/kUQdtQTFbADduAxRBIVctsagThh4AScwGPIpixC73b4ZMcn
//qoSvcw==
