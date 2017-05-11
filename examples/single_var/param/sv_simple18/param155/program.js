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
      var x = new Int8Array(data.x_sab); x[1] = 1;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 258;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 258;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 512";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 512";
outputs[11] = "id6_R_t2: 258;id7_R_t2: 512";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 514";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 514";
outputs[15] = "id6_R_t2: 258;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0c0mD4sIixY0KddFlEOIiYK2LdCV9d5PmwjQ90XQyuSz+XThzJpdJ+Ag/
//w/lun3zvE85ZHPnhOkzELZvfxdGiPOZ8u4s+PtOGpyW7Zz/XcSTCTZh4s3SGPB7dzNhJVZFVbVQl2SvJ
//XkVW83vNqvmd5lUv7di+x19ZXRjdZl021FVDXTfU/YbrFvdzYA8vj+z5FWvWfs1qT++TVbNXkr2S7FVk
//ryJ7Ndmr6735O14vV8eXfLLC5dOlM+fZ7KZBrxhcUIPir0FZXn5VfGLk+enZ+cy3TTbzcMUpBAQQAAJA
//wBUC3hkC1TLP+yeAuKo9DNoHDaABNPT3f1AtpzckDdIBDQFoAA2goRMNZz8GQ8EgyBfenQUzTxBAASgA
//hXHyBHk2WC246JAm1OrFOS/MGAADYAAMo2QMLlhonTDYY3GSO4ALcAEuRskd3HIhe+MiABfgAlyMm0XY
//YWGVRFhTYeYT2gMVoAJUTGbHQ7Ww0l1Coa0SCtAAGkDDZPZBXA6DbUahLTMKgAEwAMZkdkd0AUP2BkYA
//MAAGwJjenok2XLjIKbRlTqFABagAFQPmFEZy6TKlUCQXthkFWAALYGG4jMIpCv8lFJ2pqOUTwAJYAIvh
//8omesJA9YREAC2ABLEbJJjpScUky0R6KX3g6Yjg=
