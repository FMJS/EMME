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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[4] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 65537;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 65793;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[9] = "id6_R_t3: 1;id7_R_t3: 1";
outputs[10] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[11] = "id6_R_t3: 257;id7_R_t3: 1";
outputs[12] = "id6_R_t3: 65536;id7_R_t3: 1";
outputs[13] = "id6_R_t3: 65537;id7_R_t3: 1";
outputs[14] = "id6_R_t3: 65792;id7_R_t3: 1";
outputs[15] = "id6_R_t3: 65793;id7_R_t3: 1";
outputs[16] = "id6_R_t3: 0;id7_R_t3: 256";
outputs[17] = "id6_R_t3: 1;id7_R_t3: 256";
outputs[18] = "id6_R_t3: 256;id7_R_t3: 256";
outputs[19] = "id6_R_t3: 257;id7_R_t3: 256";
outputs[20] = "id6_R_t3: 65536;id7_R_t3: 256";
outputs[21] = "id6_R_t3: 65537;id7_R_t3: 256";
outputs[22] = "id6_R_t3: 65792;id7_R_t3: 256";
outputs[23] = "id6_R_t3: 65793;id7_R_t3: 256";
outputs[24] = "id6_R_t3: 0;id7_R_t3: 257";
outputs[25] = "id6_R_t3: 1;id7_R_t3: 257";
outputs[26] = "id6_R_t3: 256;id7_R_t3: 257";
outputs[27] = "id6_R_t3: 257;id7_R_t3: 257";
outputs[28] = "id6_R_t3: 65536;id7_R_t3: 257";
outputs[29] = "id6_R_t3: 65537;id7_R_t3: 257";
outputs[30] = "id6_R_t3: 65792;id7_R_t3: 257";
outputs[31] = "id6_R_t3: 65793;id7_R_t3: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnU1v2kAQhu/9FT62UiQHb9ZWW/XQqIp6aSulhxxRJXJAapoeyKnKfy9fgQUWErwzs8Z5bmixl4CZ
//J28y8/oty/uHyd+HSVkW41E9vB5O3Ifi/ON41Dw9Lsu7+9Ht7+kBXy+LT8W/t+NRNbwZTgZn0zPc/NG7
//s2K6ejF7XM1W/fzRYnWx52x1seNidTA94u7X+M9svQr2CNfdnvWLYPdw3e9Zr/e87vLneSw+f/9SfPvR
//x/c2X1+/o3D39aqPrtbRHcJ9XXRfF93XRfd10X3Xn3UdXQ2P9dFj/faxi2t8fXk1v8gbV+7pU5ueeT47
//e9+Tg0NPVoeedMsnm0Ov2cRfc/mDXy2/nNH942cvzvx5Mzvz8U0ZK/MBZU6Zv74yT6/k9ZOrC3+uX+SR
//V21d+pWvKX6Kn9/xKcW/usADy+J3AsXfUPwU/+sr/tRf7rlLP/yyyQIBNQAQUANJtFh9JKZICC8EaoDi
//p/gzqIE8pR9XA+lAqL136AGQgB444v+Gu7xYvfnKEgpepPxRBJQ/nYEERZCn+OOKQAIJzfsKJIAEFMGx
//LYHcSHCKSHAgASS8PiSkNQq6qREcygFMgImMymHnf4i5QXER/WqiHEACSLBQDp0DwvP9BklMhB6EAYgA
//EagGLQ/CbtcywFJ7B8LW+nLPI30JlD6lT/dByZcgUfgvdiW0xsHmdCJAAAhoASWvgiwQnBoQGoAAEJhY
//1PYv6OkDC0igGoAEqsHA0yCLiWcGmFENAAEgdNnnYKEatCCx7X0AE2AC3aDkfZAFhVdEAsoBJNCRUPdD
//WCgHPUxsTjqCCTCBclDxSOh1KWww4cAEmGD6Udc3Yd27QGGADtDREy+FXkcDhQEmwEQv/BXWfQ59dISe
//i8rXgANwoC/skh+Cv3nEXBeuleuC4qf46XIY5kEcX/ptfReu5QQlSAAJ6AHDlIgUJDg1JDQgASQwRZkj
//O0JKI1hgAuUAJlAOmRIlUkBx3GA1ygEkgITO50zIKwctTGz7LwAFoEA7GKZPpKDCK0IB9QAU6E5kyaSQ
//Vw96oNickAQUgAL1YJZUIdWxsAGFAxSAgilJ+/wK3T4GKgN4AI8ep1pIdTdQGYACUPQ260K356EPj00v
//RgM4AAcKQ9SLcWBWO8WJER/HbuvDoPApfDodkj4M0bJ/zoWRCoPtSUpwAA7QAZIeDCUcOCUcNOAAHDBF
//qeS/MNAG+ohAMYAIFIOe90IJEvGRahQDOAAH3fVdmCoGHUTsei6ABJBAM0h6LpQw4dWAgGoACHQhtPwW
//pqpBCxLbU5BAAkigGuS8FgadCQtIOCABJJiAVPFZZOtXoC4AB+A4ZY+FQRcDdQEkgMTp+iuy9Ta0wUHO
//BdBAWWTLuQhoJJZzsdyTnAuKn+Lvbs7F8aXfNufi5UDgbtUgAT2QLeciBQlODQncbxIkMDWZJedCSiNY
//YALlACZQDplyLlJAcdwN7FEOIAEkdD7nQl45aGGCnAtAgXbImHORggqvCAXUA1CgO5El50JePeiBgjtQ
//AwrUQ6acC6mOhQ0ouAM1oGBCMkPOhW4fA5UBPIBHj3MupLobqAxAASh6m3Oh2/PQhwc5F4ADhZEp5yLF
//iREfx27rw6DwKXw6HUY5F/IujFQYcNdqcIAOyJRzIe/ASMcB958EB0xRZsi5sHJfoBhABIg40ZwLeecF
//igEcgIOTzLmwcl2kIoKcCyCBZsiWcyHvuJAAAqoBINCFyJBzYeW2SIcEd6IGEqiGLDkXVk4LCUhwJ2og
//wQSkec5FXpcF6gJwAI4TzbmwcligLoAEkDjJnIu87oqXg+M/znFtLQ==
