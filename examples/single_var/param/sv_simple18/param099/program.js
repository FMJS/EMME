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
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 512;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 512;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 513";
outputs[7] = "id6_R_t2: 512;id7_R_t2: 513";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9rwjAYBvD7PkWOGwgxeRuFjR0mQ3bZBu7gsQzqoTDnDvU0/O5rbS21vt1qmtbqnpu8edM/qfxo
//Hirlah19rSMpRRiM/Jkf6VsxvAuD8e63lMtVsPiIG54m4l58X4eB9ud+pAbxDNr+uhmIvarHVk2hSmwv
//sb0eW02vNammV5pWVdyxfA8/k7oudBfrVFH3Kuqmoj6qOG92PRvx8PIonl+xZvXXrHT3I7Za7CW2l9he
//j+312F7D9ppyb/qMZ5Pp9iHvrfDu7uKZw2R21aDKBsfcoP5tkHann2Z/Mfb4/Ox05ts8mbm5kkAACACB
//VhFQBwjkyzxsnwDmrNYwGKVBA2gADe29H+TLqbqkgUADaAANJ6fh4MWgKxg0+8Cbs1DcSiigABSAwmny
//BDoYzBdcN0gTSvXsmIABMACGc8gYXLBQO2GwxmJ/cwEuwAW4OEnu4JYLAhfgAlxcahZhh4VVEuFkGxKz
//ASpABajoyxcP+cKSu4TCgAbQABrO+zuI42GwzSiM5aYDYAAMgNGbryOagEEAA2AAjP/0zUQdLlzkFLab
//EQIVoAJUdJhTFJJLlymFx3IBFsACWOh/RuEUhb8SiqZUlLcbwAJYAIvu8omWsCBgASyAxUVlEw2pOCaZ
//qA/FD7OmYfg=
