import { StyledContainer, InnerContainer, ExtraText } from "./styles";

export const renderReviewMessage = (message) => {
    return (
        <StyledContainer>
            <InnerContainer>
                <ExtraText>{message}</ExtraText>
            </InnerContainer>
        </StyledContainer>
    );
}