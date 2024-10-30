import React, { useState, useEffect } from "react";
import UploadBook from "../AddBook/file";
import BookList from "../List/file";


function MainPage() {
    
    return (  

        <div>
            <UploadBook />
            <BookList/>
        </div>
    );
}

export default MainPage;