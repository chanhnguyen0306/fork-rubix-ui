import React from "react";
import { FileUploader } from "file-uploader-react-component";
// @ts-ignore
// import FileUpload from "react-mui-fileuploader"
//
// class Upload extends React.Component<{}> {
//     // fileUploaded:any
//     // fileGot:any
//
//
//      handleFileUploadError = (error:any) => {
//         // Do something...
//          console.log(error)
//     }
//
//      handleFilesChange = (files:any) => {
//         // Do something...
//          console.log(files.length)
//          if (files.length >0) {
//              console.log(files[0].path)
//          }
//
//
//
//     }
//
//
//
//
//     render() {
//         // console.log(11111, this.fileUploaded)
//         // console.log(222, this.fileGot)
//         return (
//             <FileUpload
//                 multiFile={true}
//                 disabled={false}
//                 title="My awesome file uploader"
//                 header="[Drag to drop]"
//                 leftLabel="or"
//                 rightLabel="to select files"
//                 buttonLabel="click here"
//                 buttonRemoveLabel="Remove all"
//                 maxUploadFiles={0}
//                 errorSizeMessage={'fill it or move it to use the default error message'}
//                 onFilesChange={this.handleFilesChange}
//                 onError={this.handleFileUploadError}
//                 bannerProps={{ elevation: 0, variant: "outlined" }}
//                 containerProps={{ elevation: 0, variant: "outlined" }}
//             />
//         )
//     }
//
// }
//
// export default Upload;


class Upload extends React.Component<{}> {
    // fileUploaded:any
    // fileGot:any


    fileGot = (response: any) => {
        console.log(1111)
        console.log(response)
        console.log(11111)
        let reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onload = function () {
            console.log(222)
            console.log(reader.result)
            console.log(222)
        };
    }
    fileUploaded = (file: File | Blob) => {
        console.log(222)
        console.log(file)
        console.log(222)
    }


    render() {
        // console.log(11111, this.fileUploaded)
        // console.log(222, this.fileGot)
        return (
            <FileUploader fileUploaded={this.fileUploaded}
                          fileGot={this.fileGot}
                          accept='*'
                          multiple={true}>
            </FileUploader>
        );
    }

}

export default Upload;