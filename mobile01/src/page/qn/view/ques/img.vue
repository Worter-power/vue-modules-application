<template>
    <div>
        <el-upload :action="imgUrl" name="fileUpload" class="upload-box" :data="upladeData"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <el-button type="primary" v-loading="loading" v-if="!defaultImg">{{$store.state.lang.qn.b101}}<i class="el-icon-upload el-icon--right"></i></el-button>
            <img v-else :src="defaultImg" alt="" style="height: 36px; vertical-align: middle;">
        </el-upload>
        <!-- 选择图片 -->
        <el-dialog2 :title="$store.state.lang.qn.b64" append-to-body width="1300px" height="600px" :visible.sync="setResPhotodialog">
            <div slot="body">
                <el-cropper v-if="setResPhotodialog" ref="cropper" 
                    :img="option.img" 
                    :output-size="option.size" 
                    :output-type="option.outputType" 
                    :info="true" 
                    fixed
                    :fixedNumber="[size.width, size.height]"
                    :full="option.full" 
                    :can-move="option.canMove" 
                    :can-moveBox="option.canMoveBox" 
                    :fixed-box="option.fixedBox" 
                    :original="option.original" 
                    :auto-crop="option.autoCrop" 
                    :auto-crop-width="option.autoCropWidth" 
                    :auto-crop-height="option.autoCropHeight" 
                    :center-box="option.centerBox" 
                    :high="option.high" 
                    :info-true="option.infoTrue" 
                    :enlarge="option.enlarge">
                </el-cropper>
            </div>
            <div slot="footer">
                <el-button @click="setResPhotodialog = false" size="small">{{$store.state.lang.button.cancel}}</el-button>
                <el-button type="primary" @click="submitcutCover">{{$store.state.lang.button.ok}}</el-button>
            </div>
        </el-dialog2>
    </div>
</template>

<script>
import { convertImageBase64 } from "../request.js";
export default {
    props: {
        size: {
            type: Object,
            default: ()=>{
                return {
                    width: 285,
                    height: 380
                }
            }
        },
        sort: Number,
        defaultImg: String
    },
    data(){
        return {
            imgUrl: window.ShiYue.base + '/zuul/api/storage/upload',
            upladeData: {
				serverid: 'qn'
            },
            setResPhotodialog: false,
            option: {
                newImgId: undefined,
                newImgUrl: undefined,
                img: undefined,
                imgName: '',
                suffix: '',
                size: 1,
                full: false,
                outputType: "png",
                canMove: true,
                fixedBox: false,
                original: false,
                canMoveBox: true,
                autoCrop: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 300,
                autoCropHeight: 400,
                centerBox: false,
                high: true,
                cropData: {},
                enlarge: 1
            },
            imgloading: false
        }
    },
    methods: {
        // 上传之前判断
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!this.$checkIsImage(file.name)) {
                this.$notify.error({
                    title: this.$store.state.lang.qn.q29,
                    message: this.$store.state.lang.qn.b106
                });
                this.imgloading = false;
                return false
            }
            if (!isLt2M) {
                this.$notify.error({
                    title: this.$store.state.lang.qn.q29,
                    message: this.$store.state.lang.qn.b107
                });
                this.imgloading = false;
                return false;
            }
            this.imgloading = true;
            return true;
        },
        // 上传成功
		handleAvatarSuccess(res, file) {
            this.loading = false;
			if (res.status === 200) {
                this.option.img = this.$store.state.imgurl + res.data.id;
                this.option.imgName = res.data.name;
                this.option.suffix = res.data.suffix;
                this.setResPhotodialog = true;
			} else {
				this.$notify.error({
                    title: this.$store.state.lang.qn.q135,
					message: this.$store.state.lang.message.uploade
				});
			}
		},

        // 确认裁剪的封面图
        submitcutCover(type) {
            // 输出
            this.$refs.cropper.getCropBlob(data => {
                var img = window.URL.createObjectURL(data);
                this.convertImgToBase64(img).then(res => {
                    this.convertImageBase64(res.slice(res.indexOf(';base64,') + 8))
                })
            });
        },
        // 利用cavern将裁剪后的图片转为base64
        convertImgToBase64(url) {
            return new Promise(resolve => {
                var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    img = new Image;
                // HTML 规范文档为 images 引入了 crossorigin 属性, 通过设置适当的头信息 CORS , 可以从其他站点加载 img 图片, 并用在 canvas 中,就像从当前站点(current origin)直接下载的一样.
                img.crossOrigin = 'Anonymous';
                img.src = url;
                img.onload = function () {
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    // 利用canvas将图片地址转为base64的格式
                    var dataURL = canvas.toDataURL(url || 'image/png');
                    resolve(dataURL)
                    canvas = null;
                };
            })
        },
        // 将裁剪后的图片的base64码重新上传到服务器
        convertImageBase64(base64Str) {
            convertImageBase64({
                serverid: 'syfile',
                fileName: this.option.imgName.slice(0, this.option.imgName.lastIndexOf('.')),
                base64Str: base64Str,
                type: this.option.suffix
            }).then(res => {
                if (res && res.status == 200) {
                    this.$notify({
                        title: this.$store.state.lang.qn.q133,
                        message: this.$store.state.lang.message.uploads,
                        type: 'success'
                    });
                    res.data.sort = this.sort;
                    this.defaultImg = this.$store.state.imgurl + res.data.id;
                    this.$emit('success', res.data)
                    this.setResPhotodialog = false;
                }else{
                    this.$notify({
                        title: this.$store.state.lang.qn.q135,
                        message: this.$store.state.lang.message.uploade,
                        type: 'error'
                    });
                }
            })
        },
    }
}
</script>