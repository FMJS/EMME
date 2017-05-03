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
      var x = new Float64Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
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
outputs[0] = "id2_R_t1: 0.0000;id5_R_t2: 0.0000";
outputs[1] = "id2_R_t1: 0.0078;id5_R_t2: 0.0000";
outputs[2] = "id2_R_t1: 0.0000;id5_R_t2: 0.0078";
outputs[3] = "id2_R_t1: 0.0078;id5_R_t2: 0.0078";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnL1u2zAUhfc+hcYGMKo/igwaZGgQBF3aAumQ0SjgDgaapIMzFXn3ypFs0RJJywmpyNbnybiHpP6o
//Dxf3kIrjx6fV36dVHEfLRTa/na/Sz1HyKSl/F8tFsQ5km0Ac3z8ufv8pm369ii6jfx83PWZl33x+V/47
//m0U7UaFFqxbtaHWIdVSuo1k7qrRo1aIdTcv/97+WD7PtFXTj+tnpcWGJV8fvxqXluPX5PEdfvl9H335w
//d0x3p3X1+ihNVBrb6iM0d0ofoYlKY1t9BGEcQRhHEO0Rqmd8e3Xz8pB3znJzzWXPZN3bJqYuMXOJuUsU
//LrFwidIlqlpsZp3hOo1i6hIzl5i7ROESC5coXaLaPNqbzuurtTL3rnr+vKt79nnp6qn3/CEGwSAYBHtH
//cGAcGu5XYpdSu5TZpRz07qLXPEkPAzLgBbyA98Ry3y6ytxct7FJhl8h6rehVAdGrzkEv6AW9h6A3fP7p
//jaoS4DqAu38SkumCW3A7mkxXvkMtgAx32OICIAbEgJiSwynbbcHI2xa3Uz9/g9nWitdj7rfgwC/4Bb9Y
//baOx2kaM3d5G234Yg12wC3Yx2kZUhjgK8KqA4MVmA7yAF5ttgrh9VW2XLBfYAltMNrLbEGUFMAyGwTDF
//hsnuaOtydztRhV0q7JLyZ68J7DXQC3qx105rJ9v7Ife11pog2wW5IBdr7XhX+I4BuiogdLHVgC7QxVab
//GGp91HLJbgEtoMVSI6sdbseaXwSrcxAMgkEwdlozXxK7lNqlzLXSwDNrpVcTLTe+mkEsNHALbsHtpC20
//iWF2n3HWG75gFsyCWWyz3gWGyYJWBQNtxyoDtIAW0E7SKjt5vB5SnSWLBa7AFXuM7HVQUywIdlmVAHbB
//LpbYIGsU5ICcVt4/38iuM3AMjrHMjn7X2Sgx/MbPOZIVg2EwjKV2VGt2Rw5iNTiI2Z0GiAExltuk8Ovx
//O2NkwcAX+GLJkf2OY79afyz/BzfTa/s=
